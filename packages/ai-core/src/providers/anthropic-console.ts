import Anthropic from '@anthropic-ai/sdk';
import { DEMO_TOOLS, type DemoToolResult } from '../demo-company.js';

/**
 * The DOLMIR public console: a real model, grounded on simulated company data.
 *
 * Architecture: the browser talks to a Next.js API route, the route calls
 * this function, this function runs a manual tool-use loop against the
 * Anthropic API. The model can only state facts it has retrieved through the
 * demo-company tools; every tool call is returned to the UI as the evidence
 * layer. The API key lives in the server environment and never leaves it.
 *
 * This module lives beside the provider because providers/ is the only zone
 * of the monorepo allowed to import the vendor SDK.
 */

export interface ConsoleTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConsoleReply {
  text: string;
  evidence: { tool: string; label: string; data: unknown }[];
}

const MODEL = process.env['DOLMIR_CONSOLE_MODEL'] ?? 'claude-opus-5';
const MAX_TOOL_ROUNDS = 5;

const SYSTEM = `Sei DOLMIR, un sistema software intelligente per aziende industriali italiane. Non sei un chatbot generico: sei la console del sistema, e parli come un sistema — preciso, calmo, concreto, in italiano.

COSA SEI: DOLMIR legge informazioni aziendali (email, PDF, ordini), le struttura, le verifica sui sistemi collegati, individua conflitti, prepara azioni e si ferma davanti alle decisioni che richiedono giudizio umano.

AMBIENTE: questa è la demo pubblica. Sei collegato ESCLUSIVAMENTE a un'azienda dimostrativa con dati simulati (ordini, clienti, preventivi, fatture, produzione, documenti). Non hai accesso a dati reali di nessuna azienda. Se te lo chiedono, dillo con naturalezza: sei un modello reale su dati aziendali simulati.

REGOLE FERREE:
1. Ogni fatto sull'azienda demo (numeri, date, stati, importi, nomi) DEVE venire da uno strumento. Se non l'hai letto da uno strumento, non lo affermi. Mai inventare record.
2. Se uno strumento non trova nulla, dillo. "Non lo trovo" è una risposta corretta.
3. Quando proponi un'azione, marcala sempre come raccomandazione che richiede approvazione umana: DOLMIR non esegue mai da solo ciò che richiede giudizio.
4. Risposte brevi: 2-5 frasi, poi eventualmente un elenco puntato essenziale. Niente saluti prolissi, niente markdown pesante (solo trattini per elenchi).
5. Domande fuori tema (politica, ricette, codice, altro): rispondi con una riga cortese che sei la console di DOLMIR e riporta la conversazione sul sistema.
6. Per domande su cosa fa DOLMIR come prodotto, rispondi dalla tua identità (leggere → capire → verificare → preparare → persona → azione), senza strumenti.
7. Mai promettere risultati commerciali, percentuali di risparmio o referenze: per quello c'è il contatto umano (pagina /contatto).`;

function buildTools(): Anthropic.Tool[] {
  return Object.entries(DEMO_TOOLS).map(([name, t]) => ({
    name,
    description: t.description,
    input_schema: t.input_schema as Anthropic.Tool.InputSchema,
  }));
}

export function consoleConfigured(): boolean {
  return Boolean(process.env['ANTHROPIC_API_KEY'] ?? process.env['ANTHROPIC_AUTH_TOKEN']);
}

export async function runConsole(history: ConsoleTurn[]): Promise<ConsoleReply> {
  const client = new Anthropic({ timeout: 45_000, maxRetries: 1 });
  const tools = buildTools();
  const evidence: ConsoleReply['evidence'] = [];

  const messages: Anthropic.MessageParam[] = history.map((t) => ({
    role: t.role,
    content: t.content,
  }));

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      tools,
      messages,
      output_config: { effort: 'low' },
    });

    if (res.stop_reason === 'refusal') {
      return {
        text: 'Preferisco non rispondere a questa richiesta. Chiedetemi degli ordini, dei clienti o del funzionamento del sistema.',
        evidence,
      };
    }

    if (res.stop_reason !== 'tool_use') {
      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim();
      return { text, evidence };
    }

    // Execute every requested tool locally and hand all results back at once.
    messages.push({ role: 'assistant', content: res.content });
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== 'tool_use') continue;
      const tool = DEMO_TOOLS[block.name];
      let out: DemoToolResult;
      try {
        out = tool
          ? tool.run((block.input ?? {}) as Record<string, unknown>)
          : { label: 'STRUMENTO SCONOSCIUTO', data: null };
      } catch {
        out = { label: `${block.name} · errore`, data: null };
      }
      evidence.push({ tool: block.name, label: out.label, data: out.data });
      results.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: JSON.stringify(out.data ?? null),
      });
    }
    messages.push({ role: 'user', content: results });
  }

  return {
    text: 'Ho consultato i dati ma non riesco a chiudere la risposta in questo giro. Riprovate con una domanda più specifica.',
    evidence,
  };
}
