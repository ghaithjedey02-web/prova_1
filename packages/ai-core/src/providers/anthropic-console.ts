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
  | { type: 'done'; text: string }
  | { type: 'error'; reason: ConsoleErrorReason };

/**
 * Why a turn failed, in a form the interface may show and the server log may
 * keep. Configuration reasons (auth, model, billing, request) mean this
 * deployment cannot answer anyone until an operator acts; the others are
 * transient and worth a retry. Never carries the credential or its value.
 */
export type ConsoleErrorReason =
  | 'auth'        // key rejected by Anthropic (401/403)
  | 'model'       // the configured model is not available to this key (404)
  | 'billing'     // the account has no credit (400 with a balance message)
  | 'request'     // any other 400/422: a bug in what we send
  | 'rate'        // upstream 429
  | 'overloaded'  // upstream 5xx/529
  | 'timeout'     // connection timed out before the first byte
  | 'network'     // could not reach Anthropic at all
  | 'aborted'     // the visitor left
  | 'unknown';

export class ConsoleError extends Error {
  constructor(
    public readonly reason: ConsoleErrorReason,
    public readonly status: number | undefined,
    message: string,
  ) {
    super(message);
    this.name = 'ConsoleError';
  }
  /** True when the failure is this deployment's configuration, not the weather. */
  get configuration(): boolean {
    return this.reason === 'auth' || this.reason === 'model' || this.reason === 'billing' || this.reason === 'request';
  }
}

/** Maps whatever the SDK threw onto one of the reasons above. */
export function classifyConsoleError(err: unknown): ConsoleError {
  if (err instanceof ConsoleError) return err;
  if (err instanceof Anthropic.APIUserAbortError) return new ConsoleError('aborted', undefined, 'aborted by the client');
  if (err instanceof Anthropic.APIConnectionTimeoutError) return new ConsoleError('timeout', undefined, err.message);
  if (err instanceof Anthropic.APIConnectionError) return new ConsoleError('network', undefined, err.message);
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return new ConsoleError('auth', err.status, err.message);
  }
  if (err instanceof Anthropic.NotFoundError) return new ConsoleError('model', 404, err.message);
  if (err instanceof Anthropic.RateLimitError) return new ConsoleError('rate', 429, err.message);
  if (err instanceof Anthropic.BadRequestError || err instanceof Anthropic.UnprocessableEntityError) {
    return new ConsoleError(/credit|billing|balance/i.test(err.message) ? 'billing' : 'request', err.status, err.message);
  }
  if (err instanceof Anthropic.APIError) {
    const status = err.status;
    return new ConsoleError(status !== undefined && status >= 500 ? 'overloaded' : 'unknown', status, err.message);
  }
  const message = err instanceof Error ? err.message : String(err);
  if (/abort/i.test(message)) return new ConsoleError('aborted', undefined, message);
  return new ConsoleError('unknown', undefined, message);
}

export interface ConsoleReply {
  text: string;
  evidence: ConsoleEvidence[];
  gate?: { question: string; options: GateOption[]; stake?: string };
  unknown?: { question: string; missing: string[] };
}

const DEFAULT_MODEL = 'claude-opus-5';
const MAX_TOOL_ROUNDS = 5;
/* Room for adaptive thinking plus a full answer. Thinking tokens count against
   this cap, so a tight value truncates the reply before it starts. */
const MAX_TOKENS = 4096;

/** The model this deployment talks to; read at call time so a changed variable needs no rebuild. */
export function consoleModel(): string {
  return process.env['DOLMIR_CONSOLE_MODEL']?.trim() || DEFAULT_MODEL;
}

/**
 * The credential exactly as the SDK should see it. Keys pasted into a hosting
 * panel arrive with trailing newlines often enough that the trim is a
 * production fix, not a nicety: a newline in a header value never reaches
 * Anthropic at all.
 */
function credential(): { apiKey?: string; authToken?: string } {
  const key = process.env['ANTHROPIC_API_KEY']?.trim();
  if (key) return { apiKey: key };
  const token = process.env['ANTHROPIC_AUTH_TOKEN']?.trim();
  if (token) return { authToken: token };
  return {};
}

/** Shape of the credential for server logs — length and prefix only, never the value. */
export function credentialShape(): string {
  const raw = process.env['ANTHROPIC_API_KEY'];
  if (raw) {
    return `api_key len=${raw.length} prefix=${raw.trim().startsWith('sk-ant-') ? 'sk-ant' : 'unexpected'} whitespace=${/\s/.test(raw) ? 'yes' : 'no'}`;
  }
  if (process.env['ANTHROPIC_AUTH_TOKEN']) return 'auth_token';
  return 'none';
}

export const SYSTEM = `Sei DOLMIR: un sistema software intelligente costruito per aziende industriali italiane, e la persona con cui il visitatore sta parlando adesso.

## Come parli
Parli italiano, in modo naturale, diretto e competente — come un bravo consulente tecnico che conosce le aziende manifatturiere e non ha bisogno di gonfiare le parole. Caldo ma asciutto. Mai burocratico, mai da brochure, mai da chatbot.

Se qualcuno ti saluta o fa una domanda leggera («Ciao, come stai?»), rispondi come risponderebbe una persona: breve, cordiale, e con naturalezza porti la conversazione su cosa potete fare insieme. Non trasformare un saluto in un disclaimer.

## Cosa sai fare
Ragiona liberamente, con la tua competenza, su tutto quello che riguarda il lavoro di un'azienda: processi, preventivi, ordini, produzione, logistica, amministrazione, automazione, integrazione di sistemi, gestionali, AI applicata, organizzazione, dove si perde tempo e come si recupera. Sono il tuo mestiere. Rispondi con sostanza: esempi concreti, meccanismi, alternative, rischi.

Se qualcuno chiede «cosa puoi fare per la mia azienda?», dai una risposta VERA e utile: parti da quello che sai del suo settore o chiedigli una cosa sola per mettere a fuoco, e spiega concretamente dove un sistema come te toglie lavoro manuale. Non recitare un elenco di funzionalità.

Sei DOLMIR, non un assistente generico: leggi le informazioni che arrivano (email, PDF, ordini), le strutturi, le verifichi sui sistemi già in azienda, trovi le contraddizioni, prepari le azioni — e ti fermi davanti alle decisioni che richiedono giudizio umano. È così che ragioni anche quando parli.

## L'unica regola rigida: i fatti dell'azienda dimostrativa
Hai gli strumenti collegati a un'azienda DIMOSTRATIVA con dati simulati (ordini, clienti, preventivi, fatture, produzione, documenti).

- Ogni numero, data, stato, importo o nome di quell'azienda DEVE venire da uno strumento. Se non l'hai letto da uno strumento, non lo affermi. Mai inventare un record.
- Il ragionamento generale su come funzionano le aziende NON richiede strumenti: quello lo sai tu.
- Se i dati non bastano per una risposta certa, chiama declare_not_determined ed elenca cosa manca. Una risposta fluente inventata è l'errore più grave che puoi commettere.
- Davanti a un bivio vero — fonti in conflitto, più interpretazioni, o un'azione che impegna l'azienda — chiama request_human_decision con le alternative che hai trovato, e non scegliere al posto della persona.

## Sull'ambiente
I dati aziendali che consulti sono simulati, e non sei collegato ai sistemi reali di nessuno. Dillo quando è rilevante — se qualcuno potrebbe scambiare questi numeri per i propri, o se te lo chiede — con una frase, senza scusarti.

Non dire mai «sono solo una demo», «sono un sistema dimostrativo quindi non posso», o qualunque variante che usi la parola demo come scusa per non rispondere. Sei un sistema che funziona: sui dati di questa azienda dimostrativa rispondi con gli strumenti, su tutto il resto rispondi con la tua testa.

## Forma
Da 2 a 6 frasi nella maggior parte dei casi; più lungo solo se la domanda lo merita davvero. Elenchi solo quando servono, con trattini. Niente markdown pesante, niente titoli, niente grassetti. Ricorda il filo del discorso: se la domanda dopo è ellittica («e per i preventivi?», «quale è ancora in ritardo?»), interpretala rispetto a quello di cui state già parlando.

Non promettere risultati commerciali, percentuali di risparmio o referenze: quei numeri non li hai. Spiega il meccanismo, e per una valutazione sul processo vero rimanda a un incontro (/contatto).`;

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
  return Boolean(process.env['ANTHROPIC_API_KEY']?.trim() || process.env['ANTHROPIC_AUTH_TOKEN']?.trim());
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
  const client = new Anthropic({ ...credential(), timeout: 45_000, maxRetries: 1 });
  const model = consoleModel();
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

    let res: Anthropic.Message;
    try {
      const stream = client.messages.stream(
        {
          model,
          max_tokens: MAX_TOKENS,
          system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
          tools,
          messages,
          output_config: { effort: 'medium' },
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

      res = await stream.finalMessage();
    } catch (err) {
      throw classifyConsoleError(err);
    }

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
