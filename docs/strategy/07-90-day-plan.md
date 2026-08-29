# 07 — 90-Day Plan

**Single objective: the first paying client.** Not a large company in 90 days.
One client, one case study, then the second.

## Calendar constraints — respect these

**Italian industry substantially closes in August.** The plan starts 31 August
2026, so week 1 lands as companies return. That is actually good timing: inboxes
are emptying and owners are re-planning the quarter.

Second dead zone: **from 20 December**. Both are built into the plan.

## Capacity rule

One person cannot run outreach at full tilt *and* deliver a project. It is risk
#6 in the register, rated high probability.

So **from week 9 outreach deliberately drops**. Not laziness — protection of the
first delivery. A badly delivered first client costs more than ten uncontacted
prospects.

---

## Phase 1 — Weeks 1–3: make the database contactable

### Week 1 (31 Aug – 6 Sep)
- [ ] Run `npm run prospect -- enrich` from a machine with internet access — **top priority, unblocks everything else**
- [ ] Hand-verify the first 30 enriched records
- [ ] Register the professional email domain on dolmir.com; configure SPF, DKIM, DMARC
- [ ] **Warm the domain** — two weeks of low volume before any cold send. Skipping this burns the domain.
- [ ] Lawyer review: MSA, DPA (GDPR Art. 28), NDA

### Week 2
- [ ] Expand from 43 to **150 qualified companies** (revised target — see §300 below)
- [ ] Prepare individual briefings for the first 40
- [ ] Polish the demo: run it ten times consecutively, time it, cut anything that doesn't earn its place
- [ ] Record the 3-minute video fallback

### Week 3
- [ ] Gmail structure live (labels, filters, signature)
- [ ] Wave 1: **20 emails**, each hand-written over the template
- [ ] First 10 cold calls
- [ ] dolmir.com live: 5 pages, nothing more

**Week 3 milestone:** 30 companies contacted, first replies.

---

## Phase 2 — Weeks 4–6: conversations

### Week 4
- [ ] Wave 2: 25 emails + 15 calls · Follow-up step 2 on wave 1
- [ ] **First discovery calls**
- [ ] After each call: upgrade the hypothesis from EVIDENCE-BASED HYPOTHESIS to CONFIRMED where the facts allow

### Week 5
- [ ] Wave 3: 25 emails + 15 calls · Target 4–6 discovery calls
- [ ] **First Audit sold** — phase milestone

### Week 6
- [ ] Deliver the first audit · Outreach continues at reduced pace
- [ ] **Falsification-trigger checkpoint** (see `04-beachhead-decision.md` §6)

**Week 6 milestone:** 80 contacted, 8+ replies, 5+ calls, 1–2 audits sold.

### 🚨 Week 6 decision point

Fewer than 3 discovery calls from 80 contacts means the problem is not
persistence — it is the message or the channel. Stop outreach for three days and
redesign. Do not send more volume of the same message.

---

## Phase 3 — Weeks 7–9: the first contract

### Week 7
- [ ] Present first audit findings
- [ ] **Implementation proposal built on their real numbers**
- [ ] Second audit in delivery

### Week 8
- [ ] Negotiation
- [ ] **🎯 FIRST IMPLEMENTATION CONTRACT SIGNED**
- [ ] Sign DPA and NDA before touching any production data

### Week 9
- [ ] Implementation kick-off
- [ ] **Outreach cut to 10 emails/week** — deliberate
- [ ] Measure the client's real baseline (never our estimates)

---

## Phase 4 — Weeks 10–13: deliver and prove it

### Weeks 10–11
- [ ] Build: extraction, history, drafts, approval
- [ ] Weekly accuracy session with the preventivista — they decide whether it is usable
- [ ] Track **Hours Actual** against budget, weekly

### Week 12
- [ ] Go live + training · 30-day hypercare begins
- [ ] **Measure the real result against the baseline**

### Week 13
- [ ] Request case study permission
- [ ] Request a reference and **two introductions** — in Lombard metalworking the owners know each other, and this is the strongest channel we will ever have
- [ ] Activate the monthly retainer
- [ ] Resume full outreach with a real case study in hand

---

## Milestones

| Week | Milestone |
|---|---|
| 3 | 30 companies contacted |
| 5 | First audit sold (€2,900) |
| 8 | **First implementation contract signed** |
| 12 | System in production, results measured |
| 13 | Case study + reference + retainer live |

## Realistic 90-day revenue

```
2–3 audits × €2,900        €5,800 – €8,700
1 implementation          €18,000 – €25,000
1 month retainer                     €950
                          -------------------
Total                     €24,750 – €34,650
```

Hitting even half of this validates the thesis and moves us to building client
two on a real case study.

---

## 🔴 What NOT to do in these 90 days

This list matters as much as the one above.

- ❌ Build the web UI before a client asks — approval can happen in their inbox
- ❌ Add a second vertical — two markets with zero clients is zero clients in two markets
- ❌ Hire
- ❌ Build a database, a queue or a vector store
- ❌ Perfect the website
- ❌ Make LinkedIn content the main activity
- ❌ Automate outreach before knowing which message works
- ❌ Accept a project outside the RFQ scope "because it's the first client" — that is precisely how you end up doing generic consulting by the hour

## On the number 300

The brief asked for 300 companies. **300 records with no contact details are
worth nothing; 150 contactable records are worth a company.**

The bottleneck in the first 90 days is not how many companies we know — it is
how many conversations one person can sustain. Realistically 120–150 contacts in
a quarter while also running calls and delivering the first project.

**So: 150 complete, enriched records in phase 1, and 300 once the first client is
delivered and the outreach machine is proven.** The enrichment pipeline is
already built and scales with no additional work.
