# Nichorr — Evidence-First Technology Research Intelligence Platform

Nichorr is an evidence-first technology research intelligence platform built for technology content creators (YouTube reviewers, PC hardware builders, gadget reviewers, tech journalists) and independent technology researchers.

The central philosophy of the platform is:
> **"Never optimize for an answer that sounds convincing. Optimize for an answer that can be defended."**

---

## 1. Key Platform Features

- **14 Core MVP Screens**:
  1. **Landing / Pitch Screen** (`/`): Value proposition, methodology & trust pitch.
  2. **Dashboard** (`/dashboard`): Overview of recent runs, state badges, claim count, and 10 Golden Benchmark shortcuts.
  3. **Create Research** (`/research/create`): Objective entry with smart presets.
  4. **Research Configuration** (`/research/[id]/config`): Depth tier (Quick, Standard, Deep) & region selection.
  5. **Research Plan** (`/research/[id]/plan`): Customizable deconstructed research questions.
  6. **Live Research Progress Tracker** (`/research/[id]/live`): Real backend state visualization without fake percentages.
  7. **Research Results Overview** (`/research/[id]/results`): Executive summary & key findings overview.
  8. **Evidence & Claim Traceability View** (`/research/[id]/evidence`): Traceability chain (`Finding` → `Claim` → `Excerpt` → `Source URL`).
  9. **Conflict View** (`/research/[id]/conflicts`): Surfacing methodological, variant, and numeric disagreements.
  10. **Community Signals View** (`/research/[id]/community`): Reddit & forum user-reported complaints with firsthand likelihood ratings.
  11. **Audience Questions View** (`/research/[id]/audience`): Identification of unanswered consumer question gaps.
  12. **Content Opportunities View** (`/research/[id]/opportunities`): Evidence-backed creator video topics and scoring.
  13. **Final Research Brief View** (`/research/[id]/brief`): Structured markdown exportable research brief.
  14. **Research History View** (`/research/history`): Audited historical runs archive.

---

## 2. Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.18.1)
- **NPM**: v9.0.0 or higher (Tested on NPM v12.0.2)

### Installation
```bash
# 1. Clone or navigate to the project directory
cd C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 3. Running Tests & Benchmarks

```bash
# Run unit tests & schema validation
npm test

# Run a golden benchmark test via API
curl -X POST http://localhost:3000/api/dev/run-benchmark \
  -H "Content-Type: application/json" \
  -d '{"benchmarkId": "bm-01-flagship-phones"}'
```

---

## 4. Database Migration Setup (Supabase / PostgreSQL)

Database migration file containing all 20 required tables:
`supabase/migrations/00001_initial_schema.sql`

To apply migration on your Supabase instance:
```bash
npx supabase db push
```

---

## 5. Architecture Summary

```text
Research Request
       ↓
Entity Resolution (SKU / Variant / Region / Firmware)
       ↓
Multi-Vector Query Planning (Primary, Independent, Contrarian, Community, Recency)
       ↓
Source Discovery & Independence Evaluator (Filter Syndications)
       ↓
Evidence Extraction (Verbatim Excerpts)
       ↓
Claim Verification & Contradiction Detection (Methodological Disagreements)
       ↓
Community Forum Signal & Audience Gap Processing
       ↓
Quality Gate Audit & Brief Synthesis
```
