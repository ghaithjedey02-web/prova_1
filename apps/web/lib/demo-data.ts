import type { HistoricQuote } from '@dolmir/rfq-engine';
import { EXAMPLE_SHOP } from '@dolmir/rfq-engine';

/**
 * Demo data for the public workflow player.
 *
 * These are the shop profile and quote history the engine reasons against.
 * Everything here is invented sample data and is labelled as such throughout
 * the interface — the company names use `.example` domains precisely so nobody
 * can mistake them for real clients.
 */
export const demoShop = EXAMPLE_SHOP;

export const demoHistory: HistoricQuote[] = [
  {
    quoteId: 'OFF-2026-118',
    date: '2026-03-14',
    customerCompany: 'Tecnoflex Lecco S.r.l.',
    partNumber: 'FL-2280',
    partDescription: 'flangia tornita con foratura periferica',
    material: 'acciaio C40',
    quantity: 150,
    unitPriceEur: 14.2,
    won: true,
  },
  {
    quoteId: 'OFF-2026-092',
    date: '2026-02-02',
    customerCompany: 'Tecnoflex Lecco S.r.l.',
    partNumber: 'FL-2101',
    partDescription: 'flangia tornita cieca',
    material: 'acciaio C40',
    quantity: 300,
    unitPriceEur: 11.8,
    won: false,
  },
  {
    quoteId: 'OFF-2025-441',
    date: '2025-11-19',
    customerCompany: 'Meccanica Sebina S.r.l.',
    partNumber: 'SUP-090',
    partDescription: 'staffa di supporto piegata',
    material: 'inox AISI 304',
    quantity: 800,
    unitPriceEur: 3.45,
    won: true,
  },
  {
    quoteId: 'OFF-2025-388',
    date: '2025-09-30',
    customerCompany: 'Idrotecnica Brianza S.r.l.',
    partNumber: 'BOC-14',
    partDescription: 'boccola tornita in ottone',
    material: 'ottone',
    quantity: 500,
    unitPriceEur: 2.1,
    won: true,
  },
];
