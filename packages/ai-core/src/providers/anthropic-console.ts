import Anthropic from '@anthropic-ai/sdk';
import { DEMO_TOOLS, SYSTEM_TOOLS, type DemoToolResult } from '../demo-company.js';

/**
 * The DOLMIR public console: a real model, grounded on simulated company data,
 * streamed event by event so the interface can show the work instead of a
 * spinner.
 *
 * Architecture: browser → Next.js API route → this function → Anthropic, with
 * a manual tool-use loop. The model may only state company facts it has
 * retrieved through the demo-company tools; every tool call is emitted to the
 * UI as evidence the moment it runs. The API key lives in the server
 * environment and never leaves it.
 *
 * The stream is the product argument. A visitor watching ANALISI → DATI →
 * VERIFICA → DECISIONE → RISPOSTA light up as the model actually reaches each
 * one is being shown the architecture, not told about it. Two of those states
 * — the human gate and NON DETERMINATO — are things the model can only say by
 * calling a tool, so they are structural rather than a promise in the copy.
 *
 * This module lives beside the provider because providers/ is the only zone of
 * the monorepo allowed to import the vendor SDK.
 */

export interface ConsoleTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** What the console reports about itself while it works. */
export type ConsoleStage = 'ANALISI' | 'DATI' | 'VERIFICA' | 'DECISIONE' | 'RISPOSTA';

export interface ConsoleEvidence {
  tool: string;
  /** Technical chip — ORDINI · 5. */
  label: string;
  /** Human sentence — "5 ordini consultati". */
  summary: string;
  data: unknown;
}

export interface GateOption {
  label: string;
  detail?: string;
}

export type ConsoleEvent =
  | { type: 'stage'; stage: ConsoleStage }
  | { type: 'evidence'; evidence: ConsoleEvidence }
  | { type: 'delta'; text: string }
  | { type: 'gate'; question: string; options: GateOption[]; stake?: string }
  | { type: 'unknown'; question: string; missing: string[] }
  | { type: 'done'; text: string };

export interface ConsoleReply {
  text: string;
  evidence: ConsoleEvidence[];
  gate?: { question: string; options: GateOption[]; stake?: string };
  unknown?: { question: string; missing: string[] };
}

const MODEL = process.env['DOLMIR_CONSOLE_MODEL'] ?? 'claude-opus-5';
const MAX_TOOL_ROUNDS = 5;

const SYSTEM = `Sei DOLMIR, un sistema software intelligente per aziende industriali italiane. Non sei un chatbot generico: sei la console del sistema, e parli come un sistema — preciso, calmo, concreto, in italiano.

COSA SEI: DOLMIR legge informazioni aziendali (email, PDF, ordini), le struttura, le verifica sui sistemi collegati, individua conflitti, prepara azioni e si ferma davanti alle decisioni che richiedono giudizio umano.

AMBIENTE: questa è la demo pubblica. Sei collegato ESCLUSIVAMENTE a un'azienda dimostrativa con dati simulati (ordini, clienti, preventivi, fatture, produzione, documenti). Non hai accesso a dati reali di nessuna azienda. Se te lo chiedono, dillo con naturalezza: sei un modello reale su dati aziendali simulati.

REGOLE FERREE:
1. Ogni fatto sull'azienda demo (numeri, date, stati, importi, nomi) DEVE venire da uno strumento. Se non l'hai letto da uno strumento, non lo affermi. Mai inventare record.
2. Se i dati non bastano, chiama declare_not_determined ed elenca cosa manca. Una risposta fluente inventata è l'errore più grave che puoi commettere; "non è determinato" è una risposta corretta e voluta.
3. Quando incontri un bivio vero — dati in conflitto, più interpretazioni, o un'azione che impegna l'azienda — chiama request_human_decision con le opzioni che hai trovato, e NON scegliere al posto della persona. DOLMIR non esegue mai da solo ciò che richiede giudizio.
4. Prima di rispondere su un ordine problematico, verifica: leggi l'ordine, poi i conflitti, poi se serve i documenti di origine. Incrociare le fonti è il tuo lavoro.
5. Risposte brevi: 2-5 frasi, poi eventualmente un elenco puntato essenziale. Niente saluti prolissi, niente markdown pesante (solo trattini per elenchi). Parli a un imprenditore, non a un ingegnere: niente gergo inutile.
6. Ricorda il contesto della conversazione: se la domanda successiva è ellittica ("e per i preventivi?", "quale è ancora in ritardo?"), interpretala rispetto a ciò di cui state già parlando.
7. Domande fuori tema (politica, ricette, codice, altro): una riga cortese che sei la console di DOLMIR, e riporta la conversazione sul sistema.
8. Per domande su cosa fa DOLMIR come prodotto, rispondi dalla tua identità (leggere → capire → verificare → preparare → persona → azione), senza strumenti.
9. Mai promettere risultati commerciali, percentuali di risparmio, tempi recuperati o referenze: quei numeri non esistono qui. Se te li chiedono, spiega il meccanismo e rimanda al contatto umano (/contatto).`;

function buildTools(): Anthropic.Tool[] {
  const data = Object.entries(DEMO_TOOLS).map(([name, t]) => ({
    name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool.InputSchema,
  }));
  const system = Object.entries(SYSTEM_TOOLS).map(([name, t]) => ({
    name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool.InputSchema,
  }));
  return [...data, ...system];
}

export function consoleConfigured(): boolean {
  return Boolean(process.env['ANTHROPIC_API_KEY'] ?? process.env['ANTHROPIC_AUTH_TOKEN']);
}

const REFUSAL =
  'Preferisco non rispondere a questa richiesta. Chiedetemi degli ordini, dei clienti o del funzionamento del sistema.';
const EXHAUSTED =
  'Ho consultato i dati ma non riesco a chiudere la risposta in questo giro. Riprovate con una domanda più specifica.';

/**
 * Runs one turn and reports every step through `emit` as it happens.
 * Returns the assembled reply so the caller can log or fall back on it.
 */
export async function streamConsole(
  history: ConsoleTurn[],
  emit: (e: ConsoleEvent) => void,
  signal?: AbortSignal,
): Promise<ConsoleReply> {
  const client = new Anthropic({ timeout: 45_000, maxRetries: 1 });
  const tools = buildTools();
  const evidence: ConsoleEvidence[] = [];
  let gate: ConsoleReply['gate'];
  let unknown: ConsoleReply['unknown'];
  let text = '';
  /* Cross-checking is a distinct claim from looking something up, so the
     second data tool of a turn moves the console into VERIFICA. */
  let dataCalls = 0;

  const messages: Anthropic.MessageParam[] = history.map((t) => ({ role: t.role, content: t.content }));

  emit({ type: 'stage', stage: 'ANALISI' });

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    if (signal?.aborted) return { text, evidence, gate, unknown };

    const stream = client.messages.stream(
      {
        model: MODEL,
        max_tokens: 1200,
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        tools,
        messages,
        output_config: { effort: 'low' },
      },
      { signal },
    );

    let spoke = false;
    for await (const ev of stream) {
      if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta' && ev.delta.text) {
        if (!spoke) { spoke = true; emit({ type: 'stage', stage: 'RISPOSTA' }); }
        text += ev.delta.text;
        emit({ type: 'delta', text: ev.delta.text });
      }
    }

    const res = await stream.finalMessage();

    if (res.stop_reason === 'refusal') {
      emit({ type: 'delta', text: REFUSAL });
      emit({ type: 'done', text: REFUSAL });
      return { text: REFUSAL, evidence, gate, unknown };
    }

    if (res.stop_reason !== 'tool_use') {
      const final = text.trim();
      emit({ type: 'done', text: final });
      return { text: final, evidence, gate, unknown };
    }

    // Execute every requested tool locally and hand all results back at once.
    messages.push({ role: 'assistant', content: res.content });
    const results: Anthropic.ToolResultBlockParam[] = [];

    for (const block of res.content) {
      if (block.type !== 'tool_use') continue;
      const input = (block.input ?? {}) as Record<string, unknown>;

      if (block.name === 'request_human_decision') {
        const options = Array.isArray(input['options'])
          ? (input['options'] as Record<string, unknown>[])
              .filter((o) => o && typeof o === 'object')
              .slice(0, 4)
              .map((o) => ({ label: String(o['label'] ?? '').slice(0, 90), detail: o['detail'] ? String(o['detail']).slice(0, 220) : undefined }))
              .filter((o) => o.label)
          : [];
        const question = String(input['question'] ?? '').slice(0, 240);
        const stake = input['stake'] ? String(input['stake']).slice(0, 200) : undefined;
        if (question && options.length) {
          gate = { question, options, stake };
          emit({ type: 'stage', stage: 'DECISIONE' });
          emit({ type: 'gate', question, options, stake });
        }
        results.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: 'Decisione presentata alla persona nell’interfaccia. Non scegliere al suo posto: spiega il bivio in 1-2 frasi.',
        });
        continue;
      }

      if (block.name === 'declare_not_determined') {
        const missing = Array.isArray(input['missing'])
          ? (input['missing'] as unknown[]).map((m) => String(m).slice(0, 160)).filter(Boolean).slice(0, 5)
          : [];
        const question = String(input['question'] ?? '').slice(0, 240);
        unknown = { question, missing };
        emit({ type: 'stage', stage: 'DECISIONE' });
        emit({ type: 'unknown', question, missing });
        results.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: 'Stato NON DETERMINATO mostrato nell’interfaccia. Aggiungi una riga onesta su cosa servirebbe per rispondere.',
        });
        continue;
      }

      const tool = DEMO_TOOLS[block.name];
      let out: DemoToolResult;
      try {
        out = tool
          ? tool.run(input)
          : { label: 'STRUMENTO SCONOSCIUTO', summary: 'Strumento non disponibile', data: null };
      } catch {
        out = { label: `${block.name} · errore`, summary: 'Lettura non riuscita', data: null };
      }
      dataCalls += 1;
      emit({ type: 'stage', stage: dataCalls > 1 ? 'VERIFICA' : 'DATI' });
      const item: ConsoleEvidence = { tool: block.name, label: out.label, summary: out.summary, data: out.data };
      evidence.push(item);
      emit({ type: 'evidence', evidence: item });
      results.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: JSON.stringify(out.data ?? null),
      });
    }

    messages.push({ role: 'user', content: results });
  }

  const final = text.trim() || EXHAUSTED;
  emit({ type: 'done', text: final });
  return { text: final, evidence, gate, unknown };
}

/** Non-streaming convenience wrapper, kept for server-side callers and tests. */
export async function runConsole(history: ConsoleTurn[]): Promise<ConsoleReply> {
  return streamConsole(history, () => { /* collected in the return value */ });
}
