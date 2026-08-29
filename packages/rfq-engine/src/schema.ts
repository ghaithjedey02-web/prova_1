import type { ExtractionSchema } from '@dolmir/ai-core';

/**
 * The RFQ extraction contract.
 *
 * Field descriptions are written in the client's own vocabulary (Italian shop
 * terms) because that is what makes extraction accurate on real documents. This
 * schema is the highest-leverage tuning surface in the product — when accuracy
 * is short on a client's documents, change this before changing anything else.
 */
export const RFQ_SCHEMA: ExtractionSchema = {
  customerCompany: {
    type: 'string',
    description: 'Ragione sociale of the company REQUESTING the quote (the sender, not the recipient).',
    required: true,
  },
  contactName: {
    type: 'string',
    description: 'Full name of the person who signed or sent the request.',
  },
  partDescription: {
    type: 'string',
    description: 'Short description of the part or work requested, e.g. "flangia tornita", "staffa in lamiera piegata".',
    required: true,
  },
  partNumber: {
    type: 'string',
    description: 'Customer part code / codice articolo / numero disegno, exactly as written.',
  },
  quantity: {
    type: 'number',
    description: 'Number of pieces requested. If a range or multiple lots, give the primary quantity.',
    required: true,
  },
  material: {
    type: 'string',
    description: 'Material specification exactly as written, e.g. "AISI 316L", "C40", "alluminio 6082", "39NiCrMo3".',
  },
  tolerance: {
    type: 'string',
    description: 'Any tolerance or precision requirement mentioned, e.g. "H7", "±0,05 mm", "IT7".',
  },
  surfaceTreatment: {
    type: 'string',
    description: 'Surface or heat treatment requested, e.g. zincatura, nichelatura, anodizzazione, tempra, cementazione.',
  },
  deliveryDeadline: {
    type: 'string',
    description: 'Requested delivery date or lead time, verbatim, e.g. "entro il 15 ottobre", "4 settimane".',
  },
  drawingReference: {
    type: 'string',
    description: 'Filename of the attached technical drawing, e.g. "DIS-4471.pdf".',
  },
  isRecurringOrder: {
    type: 'boolean',
    description: 'True only if the text explicitly indicates a repeat/recurring order or an existing framework agreement.',
  },
};

export const EXTRACTION_INSTRUCTIONS = [
  'You are processing an inbound email received by an Italian precision-machining',
  'subcontractor (officina di lavorazioni meccaniche conto terzi) in Lombardy.',
  'The email is usually in Italian and may contain a request for quotation (richiesta di offerta / RdO).',
  'Extract the commercial and technical parameters of the request.',
  '',
  'Domain notes:',
  '- "pz", "pezzi", "n." typically precede quantities.',
  '- Material codes follow Italian/EU conventions (AISI, C40, S235, 39NiCrMo3, 42CrMo4).',
  '- Do NOT attempt to estimate machining time, weight or price. Those are out of scope.',
].join('\n');

/**
 * Confidence floor per field.
 *
 * Fields that drive money (quantity, material) are gated harder than
 * descriptive ones. Below the floor the field goes to a human — the whole
 * design assumes a person is in the loop and optimises for their attention,
 * not for full autonomy.
 */
export const CONFIDENCE_FLOOR: Record<string, number> = {
  customerCompany: 0.7,
  contactName: 0.5,
  partDescription: 0.6,
  partNumber: 0.75,
  quantity: 0.8,
  material: 0.75,
  tolerance: 0.5,
  surfaceTreatment: 0.6,
  deliveryDeadline: 0.5,
  drawingReference: 0.6,
  isRecurringOrder: 0.6,
};

export const DEFAULT_CONFIDENCE_FLOOR = 0.7;
