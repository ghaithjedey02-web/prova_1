# 01 — Market Analysis: Lombardia

**Status:** Baseline research, August 2026
**Owner:** Strategy
**Rule of this document:** every number carries a source. Anything unsourced is labelled as an estimate or assumption.

---

## 1. Why Lombardia is the right geography

Lombardia is not a "nice region to start in" — it is structurally the densest
concentration of the exact buyer we want in the whole of Southern Europe.

| Fact | Value | Source |
|---|---|---|
| Active companies registered in Lombardia | **808,499** (2025, −0.2% YoY) | Unioncamere Lombardia, *Demografia delle imprese in Lombardia, Anno 2025* |
| Sector split | Services 42.7%, Commerce 19.3%, Construction 15.7%, Industry 10.5%, Hospitality 6.5%, Agriculture 5.0% | ibid. |
| Mechatronics local units in Lombardia | **33,800** | Assolombarda / Confindustria Lombardia, Gruppo Meccatronici |
| Employees in Lombard mechatronics | **460,000** (27% of the Italian sector) | ibid. |
| Lombard mechatronics export | **~€84bn** (2023), 30% of Italian sector export | ibid. |
| Share of Lombard manufacturing that is mechatronics | 41% of local units, 51% of employees, 53% of export | ibid. |

Derived (our calculation, flagged as **ESTIMATE**): industry at 10.5% of 808,499
implies roughly **85,000 industrial companies** in Lombardia. Mechatronics'
33,800 local units is the single largest coherent industrial cluster in the region.

## 2. The AI adoption window

This is the most important timing fact in this document.

| Fact | Value | Source |
|---|---|---|
| Italian firms (10+ employees) using ≥1 AI technology, 2025 | **16.4%** | Istat, *Imprese e ICT — Anno 2025* |
| Same figure, 2024 | 8.2% | ibid. |
| Same figure, 2023 | 5.0% | ibid. |
| SMEs specifically, 2025 | **15.7%** (up from 7.7% in 2024) | ibid. |
| Firms with 10–49 employees | 14% | ibid. |
| Firms with 250+ employees | 53% | ibid. |
| North-West (includes Lombardia) | **19.3%** — highest in Italy | ibid. |
| Top barrier: lack of in-house skills | **58.6%** | ibid. |
| Barrier: unclear legal liability | 47.3% | ibid. |
| Barrier: data availability | 45.2% | ibid. |

**Read this correctly.** Adoption doubled year-on-year, so the market is no
longer in "what is AI" education mode — that phase is expensive and we cannot
afford to fund it. But 84% of firms still have not adopted, so the market is
also not saturated. We are arriving in the steep part of the curve.

Critically: **the #1 barrier is lack of in-house skills (58.6%)**, not lack of
belief and not lack of money. That is precisely the barrier an implementation
company removes. Our business exists because of that one statistic.

## 3. The funding tailwind (and its expiry)

| Fact | Detail | Source |
|---|---|---|
| Transizione 5.0 tax credit | Applies to 2024–2025 investments; usable in offset via F24 **only until 31 Dec 2026** | Ipsoa; PMI.it |
| Replacement mechanism | From 1 Jan 2026 the 2026 Budget Law replaces the tax credit with **super-depreciation** (maggiorazione IRES/IRPEF) | PMI.it; BibLus |
| New plan preliminary applications | GSE portal opened **12 June 2026** | BibLus |
| Qualifying condition | Must be a "4.0 good" (Annexes A/B of L.232/2016) **and** deliver certified energy saving ≥3% facility-wide or ≥5% on the affected process | Ipsoa |

**Co-founder note — do not oversell this.** The energy-saving requirement means
a pure software/AI workflow project usually does **not** qualify for Transizione
5.0 on its own. It qualifies when bundled into a wider Industry 4.0 investment.
We should mention incentives as context, never as a promise. Promising a client
a tax credit they then fail to obtain is how a young consultancy dies.

## 4. Competitive landscape

The Italian "AI automation" supplier market has already split into tiers:

**Tier 1 — Commoditised low-end (crowded).** Freelance and boutique n8n/Make/Zapier
consultancies. Public pricing: **€3,000–€8,000** per project, €50–200/month tooling,
payback pitched at 3–5 months. Dozens of players publish near-identical content.
*Implication: we must not enter here. There is no pricing power and no defensibility.*

**Tier 2 — Vertical software vendors (entrenched).** ERP/gestionale vendors already
own the sector-specific workflow: Zucchetti, TeamSystem, Dylog, Integro360,
Dolimetal for metalworking; smeup, Ifin Sistemi, Talea, Euroged, DocuMI for
customs/logistics documents. They sell *whole systems* on long cycles.
*Implication: never compete head-on with a full ERP replacement. Sit beside it.*

**Tier 3 — Large consultancies.** Priced out of the SME segment entirely.

**The gap we occupy:** a point solution to one expensive workflow, priced on the
business value it creates, installed alongside the ERP the client already owns
and will never replace. Tier 1 cannot do the domain work; Tier 2 will not sell a
€25k point solution; Tier 3 will not answer the phone.

## 5. Verticals examined

Twelve categories were required. We examined fourteen — two were added by research:

1. B2B Manufacturing (focus: metalmeccanica / meccanica di precisione)
2. Logistics / freight forwarding / spedizionieri
3. Insurance brokerages
4. Accounting / commercialisti
5. Real estate
6. Hotels / hospitality
7. Professional services
8. Construction
9. Wholesale / distribution
10. Travel / tourism
11. Automotive
12. **Serramenti / impiantistica / specialist installers** — *added by research*
13. **Private healthcare / poliambulatori** — *added by research*
14. **Food & beverage manufacturing** — *added by research*

Scoring is in `02-vertical-scoring.md`.

## 6. Research limitations — stated honestly

- `unioncamerelombardia.it` is blocked by this environment's network egress
  proxy. Sector totals above come from the search-indexed summary of their
  published report, not from our own reading of the PDF. **Re-verify before
  using in any client-facing document.**
- No per-province, per-ATECO company counts were obtainable at this stage.
  Getting them properly requires a paid Registro Imprese / Kompass / Cerved
  extract. Budgeted in the 90-day plan.
- The mechatronics figures are 2023 export / recent local-unit counts published
  by Assolombarda; treat as directionally correct, not current-quarter precise.

## Sources

- [Unioncamere Lombardia — Demografia delle imprese in Lombardia, Anno 2025](https://www.unioncamerelombardia.it/fileadmin/dati__file_report_trimestrali/I_numeri_delle_imprese/Demografia_delle_imprese/2025/Demografia_Imprese_2025_anno.pdf)
- [Istat — Imprese e ICT, Anno 2025](https://www.istat.it/comunicato-stampa/imprese-e-ict-anno-2025/)
- [Istat Statreport ICT 2025 (PDF)](https://www.istat.it/wp-content/uploads/2025/12/Statreport_ICT2025.pdf)
- [Key4biz — AI raddoppia nelle imprese italiane: dall'8,2% al 16,4%](https://www.key4biz.it/ai-raddoppia-luso-nelle-imprese-italiane-dall82-del-2024-al-164-del-2025-i-dati-istat/559811/)
- [Assolombarda — L'industria meccatronica milanese al centro del sistema manifatturiero lombardo](https://www.assolombarda.it/media/90mila-addetti-e-18-miliardi-di-euro-di-export-l2019industria-meccatronica-milanese-al-centro-del-sistema-manifatturiero-lombardo)
- [Ipsoa — Transizione 5.0: conferma dei crediti d'imposta e obblighi per le imprese](https://www.ipsoa.it/documents/quotidiano/2026/04/30/transizione-5-0-conferma-crediti-imposta-obblighi-imprese)
- [PMI.it — Transizione 5.0: scadenze e novità 2026](https://www.pmi.it/impresa/normativa/487154/transizione-5-0-scadenze-incentivi-raccordo-2026.html)
- [Fondazione Nazionale Commercialisti — Rapporto 2025 sull'Albo](https://www.fondazionenazionalecommercialisti.it/node/1836)
- [Randstad — I costi nascosti della crisi di commercialisti e contabili](https://www.randstad.it/gestione-risorse-umane/selezione-del-personale/la-crisi-di-commercialisti-e-contabili/)
