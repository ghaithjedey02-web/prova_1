/**
 * The demo company — a fictional manufacturer, fully in memory.
 *
 * This is the ONLY data the public console is allowed to answer from. Every
 * record is invented; the point is that the model must retrieve it through
 * tools instead of inventing numbers, so the public demo shows the real
 * architecture (grounded answers with evidence) on simulated company data.
 *
 * The difficult order ORD-10482 mirrors the website simulator's "Caso
 * difficile" so the console and the simulator tell one coherent story.
 */

export interface DemoOrder {
  id: string;
  customer: string;
  lines: { code: string; qty: number; note?: string }[];
  promised: string;
  status: 'in_lavorazione' | 'in_ritardo' | 'a_rischio' | 'consegnato' | 'in_revisione';
  delayDays?: number;
  reason?: string;
}

const CUSTOMERS = [
  { id: 'C-01', name: 'Officine Rossi S.r.l.', alias: 'Meccanica Rossi', city: 'Brescia', payment: '60gg', note: 'Cliente storico; nelle email si firma spesso «Meccanica Rossi».' },
  { id: 'C-02', name: 'Fonderia Bianchi S.p.A.', city: 'Bergamo', payment: '30gg', note: 'Ordini regolari, consegne al reparto fusione.' },
  { id: 'C-03', name: 'LogiTre S.p.A.', city: 'Monza', payment: '90gg', note: 'Richiede conferma d’ordine formale su ogni riga.' },
  { id: 'C-04', name: 'Elettromec Verdi S.r.l.', city: 'Varese', payment: '30gg', note: 'Un sollecito attivo su fattura scaduta.' },
] as const;

const ORDERS: DemoOrder[] = [
  {
    id: 'ORD-10482', customer: 'Officine Rossi S.r.l.',
    lines: [
      { code: 'SL-441', qty: 80, note: 'codice ambiguo: esistono SL-4410 e SL-4415' },
      { code: 'PF-2205', qty: 40, note: 'l’allegato PDF indica 60 pezzi' },
    ],
    promised: '2026-09-12', status: 'in_ritardo', delayDays: 7,
    reason: 'Quantità in contraddizione fra email e allegato, codice articolo ambiguo e capacità produttiva disponibile solo dal 19/09. Fermo al cancello umano: 4 punti da decidere.',
  },
  {
    id: 'ORD-10476', customer: 'Fonderia Bianchi S.p.A.',
    lines: [{ code: 'FL-2280', qty: 12 }],
    promised: '2026-09-08', status: 'in_lavorazione',
  },
  {
    id: 'ORD-10488', customer: 'LogiTre S.p.A.',
    lines: [{ code: 'SL-4410', qty: 200 }],
    promised: '2026-09-15', status: 'a_rischio',
    reason: 'Lotto di materiale SL-4410 in ritardo dal fornitore: arrivo previsto 11/09, margine di lavorazione ridotto a 3 giorni.',
  },
  {
    id: 'ORD-10471', customer: 'Elettromec Verdi S.r.l.',
    lines: [{ code: 'PF-2190', qty: 25 }],
    promised: '2026-08-22', status: 'consegnato',
  },
  {
    id: 'ORD-10490', customer: 'Fonderia Bianchi S.p.A.',
    lines: [{ code: 'FL-2295', qty: 6 }],
    promised: '2026-09-26', status: 'in_revisione',
    reason: 'Ordine appena ricevuto: dati estratti, in attesa di verifica.',
  },
];

const QUOTATIONS = [
  { id: 'PRV-2201', customer: 'Fonderia Bianchi S.p.A.', amountEur: 3340.0, status: 'inviato', note: 'Flangia DN80 lavorata, 12 pezzi. Preventivo preparato dal sistema e approvato da una persona.' },
  { id: 'PRV-2205', customer: 'LogiTre S.p.A.', amountEur: 11250.0, status: 'in_approvazione', note: 'Bozza pronta: aspetta l’approvazione umana prima dell’invio.' },
] as const;

const INVOICES = [
  { id: 'FT-0482', customer: 'Elettromec Verdi S.r.l.', amountEur: 8140.0, due: '2026-08-19', status: 'scaduta', overdueDays: 12, note: 'Sollecito preparato, in attesa di approvazione del tono.' },
  { id: 'FT-0479', customer: 'Fonderia Bianchi S.p.A.', amountEur: 4620.0, due: '2026-08-30', status: 'pagata' },
] as const;

const PRODUCTION = {
  updated: '2026-08-31',
  centers: [
    { name: 'Tornitura', loadPct: 92, note: 'saturo fino al 18/09' },
    { name: 'Fresatura', loadPct: 74 },
    { name: 'Montaggio', loadPct: 58 },
  ],
  exceptions: ['Materiale SL-4410: lotto fornitore in ritardo, arrivo previsto 11/09.'],
} as const;

const CONFLICTS = [
  { orderId: 'ORD-10482', field: 'cliente', detail: '«Meccanica Rossi» in email ≈ «Officine Rossi S.r.l.» in anagrafica (corrispondenza parziale 55%).' },
  { orderId: 'ORD-10482', field: 'codice', detail: 'SL-441 è ambiguo: in anagrafica esistono SL-4410 e SL-4415.' },
  { orderId: 'ORD-10482', field: 'quantità', detail: 'PF-2205: 40 pezzi nel corpo email, 60 nell’allegato PDF.' },
  { orderId: 'ORD-10482', field: 'consegna', detail: 'Richiesta 12/09; la tornitura è satura fino al 18/09.' },
] as const;

const DOCUMENTS = [
  { id: 'DOC-EMAIL-482', kind: 'email', order: 'ORD-10482', text: 'Buongiorno, confermiamo l’ordine: 80 pz SL-441 e 40 pz PF-2205, consegna richiesta il 12 settembre. Cordiali saluti, Meccanica Rossi.' },
  { id: 'DOC-PDF-482', kind: 'pdf', order: 'ORD-10482', text: 'Allegato ordine n. 184/2026 — righe: SL-441 q.tà 80; PF-2205 q.tà 60. Resa franco ns. stabilimento.' },
  { id: 'DOC-EMAIL-488', kind: 'email', order: 'ORD-10488', text: 'Vi ricordiamo che la consegna dei 200 pz SL-4410 resta confermata per il 15/09 come da accordi.' },
] as const;

/* ------------------------------------------------------------------ tools */

export interface DemoToolResult {
  /** Short human label shown in the UI evidence layer. */
  label: string;
  data: unknown;
}

type ToolFn = (input: Record<string, unknown>) => DemoToolResult;

const norm = (s: unknown) => String(s ?? '').toLowerCase().trim();

export const DEMO_TOOLS: Record<string, { description: string; input_schema: Record<string, unknown>; run: ToolFn }> = {
  get_orders: {
    description: 'Elenca gli ordini del gestionale demo. Filtro opzionale per stato: in_lavorazione, in_ritardo, a_rischio, consegnato, in_revisione.',
    input_schema: { type: 'object', properties: { status: { type: 'string' } }, additionalProperties: false },
    run: (i) => {
      const s = norm(i['status']);
      const rows = s ? ORDERS.filter((o) => o.status === s) : ORDERS;
      return { label: `ORDINI · ${rows.length} risultati`, data: rows };
    },
  },
  get_order: {
    description: 'Dettaglio di un ordine per id (es. ORD-10482).',
    input_schema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
    run: (i) => {
      const id = String(i['id'] ?? '').toUpperCase().replace(/\s/g, '');
      const o = ORDERS.find((x) => x.id === id || x.id.endsWith(id.replace(/^ORD-?/, '')));
      return o ? { label: `ORDINE · ${o.id}`, data: o } : { label: 'ORDINE · non trovato', data: null };
    },
  },
  get_delayed_orders: {
    description: 'Ordini in ritardo o a rischio, con il motivo.',
    input_schema: { type: 'object', properties: {}, additionalProperties: false },
    run: () => {
      const rows = ORDERS.filter((o) => o.status === 'in_ritardo' || o.status === 'a_rischio');
      return { label: `ORDINI CRITICI · ${rows.length}`, data: rows };
    },
  },
  get_customer: {
    description: 'Scheda cliente per nome (accetta anche nomi parziali o alias).',
    input_schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'], additionalProperties: false },
    run: (i) => {
      const q = norm(i['name']);
      const c = CUSTOMERS.find((x) => norm(x.name).includes(q) || norm('alias' in x ? x.alias : '').includes(q) || norm(x.id) === q);
      return c ? { label: `CLIENTE · ${c.name}`, data: c } : { label: 'CLIENTE · non trovato', data: null };
    },
  },
  get_quotation: {
    description: 'Preventivi: tutti, o uno per id (es. PRV-2201).',
    input_schema: { type: 'object', properties: { id: { type: 'string' } }, additionalProperties: false },
    run: (i) => {
      const id = String(i['id'] ?? '').toUpperCase();
      const rows = id ? QUOTATIONS.filter((q) => q.id === id) : [...QUOTATIONS];
      return { label: `PREVENTIVI · ${rows.length}`, data: rows };
    },
  },
  get_invoice: {
    description: 'Fatture: tutte, o filtrate per stato (scaduta, pagata).',
    input_schema: { type: 'object', properties: { status: { type: 'string' } }, additionalProperties: false },
    run: (i) => {
      const s = norm(i['status']);
      const rows = s ? INVOICES.filter((f) => f.status === s) : [...INVOICES];
      return { label: `FATTURE · ${rows.length}`, data: rows };
    },
  },
  get_conflicts: {
    description: 'Incongruenze rilevate dal sistema, con l’evidenza. Filtro opzionale per ordine.',
    input_schema: { type: 'object', properties: { order_id: { type: 'string' } }, additionalProperties: false },
    run: (i) => {
      const id = String(i['order_id'] ?? '').toUpperCase();
      const rows = id ? CONFLICTS.filter((c) => c.orderId === id) : [...CONFLICTS];
      return { label: `CONFLITTI · ${rows.length}`, data: rows };
    },
  },
  get_production_status: {
    description: 'Carico dei centri di lavoro e eccezioni di produzione.',
    input_schema: { type: 'object', properties: {}, additionalProperties: false },
    run: () => ({ label: 'PRODUZIONE · 3 centri', data: PRODUCTION }),
  },
  search_documents: {
    description: 'Cerca nel testo di email e PDF archiviati (fonte originale dei dati).',
    input_schema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: false },
    run: (i) => {
      const q = norm(i['query']);
      const rows = DOCUMENTS.filter((d) => norm(d.text).includes(q) || norm(d.order).includes(q) || norm(d.id).includes(q));
      return { label: `DOCUMENTI · ${rows.length} trovati`, data: rows };
    },
  },
};
