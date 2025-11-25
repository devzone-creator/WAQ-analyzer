# WACA - Wikipedia Article Creation Assistant

A policy-enforcing, guided **6-step wizard** for creating Wikipedia article drafts compliant with Articles for Creation (AfC) standards. WACA dramatically lowers the entry barrier for new editors by preventing common submission errors (Notability, NPOV, Formatting) and ensuring every submitted draft meets minimum quality requirements.

## 🎯 Core Features

### 6-Step Wizard Flow
1. **Notability Check** - Validate 3+ independent reliable sources proving GNG (General Notability Guideline)
2. **Lead & Infobox** - Draft article definition (1-3 sentences) with Infobox templates
3. **Citation Structure** - Add references and auto-generate standard section headings
4. **Content & NPOV** - Real-time Neutrality Dial powered by a rules-based NLP engine, which analyzes promotional density and provides guidance via highlighting
5. **Review & Metadata** - Policy compliance checklist and category suggestions
6. **Final Submission** - Package and submit to Wikipedia API Draft space

### 🎨 Real-Time Neutrality Dial (NPOV Scoring)
- **Rules-based NLP scoring** mechanism measuring promotional density
- **Weighted lexicon**:
  - High (3 pts): "groundbreaking," "revolutionary," "best-in-class" → Clear violations
  - Medium (2 pts): "leading," "innovative," "successful" → Subjective language
  - Negative (-1 pt): "according to," "sources report" → Neutralizers
- **Visual threshold mapping**:
  - 🟢 Green (≤ 0.02): Neutral - Proceed
  - 🟡 Yellow (0.02 - 0.05): Warning - Review recommended
  - 🔴 Red (> 0.05): Critical - Must revise before submission

### ✅ Source Credibility Validation
Automatic domain tier assessment:
- **High**: Academic institutions (.edu), government agencies, major news organizations
- **Medium**: Professional publications, industry news
- **Low**: Social media, blogs, forums
- **Unknown**: Requires manual verification

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📋 API & Submission Requirements

### Mandatory AfC Template
All submissions are prepended with:
```wikitext
{{subst:submit}}
```

### WACA Metadata Tag
Automatically inserted (hidden from readers) for tracking and reviewer aid:
```wikitext
{{User:WACA/Tool-Tag
| version = 1.0
| npo_score_final = [FINAL NPO SCORE]
| core_sources_1 = [SOURCE URL/TITLE]
| user_declared_coi = [YES/NO]
}}
```

### Edit Summary
All API requests use:
```
Creating new draft via WACA Tool (v1.0)
```

## 📁 Project Structure

```
src/
├── components/
│   ├── WACWizard.tsx              # Main wizard container
│   ├── WizardStepIndicator.tsx    # Step progress indicator
│   ├── Step1NotabilityCheck.tsx   # Notability validation UI
│   └── Step4ContentNPOV.tsx       # Neutrality Dial UI
├── services/
│   ├── wacWizardManager.ts        # Wizard state & validation logic
│   ├── sourceCredibilityService.ts # Domain reliability assessment
│   ├── neutralityDialService.ts   # NPOV scoring engine
│   ├── citationGeneratorService.ts # {{cite web}} generator
│   └── wikipediaApi.ts            # Wikipedia API wrapper
├── types/
│   ├── waca.ts                    # WACA core type definitions
│   └── index.ts                   # Legacy types (to be removed)
├── App.tsx                         # Main application
└── main.tsx                        # React entry point
```

## 🛠️ Technology Stack

- **Framework**: React 18.3 + TypeScript 5.5
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **NLP Processing**: Retext (text parsing)
- **Testing**: Vitest 4.0

## 📚 Development

### Type Definitions
Core WACA types are defined in `src/types/waca.ts`:
- `WACWizardState` - Complete wizard state
- `Source` - Source with credibility tier
- `NPOVScore` - Neutrality scoring result
- `AfCSubmissionPayload` - Final submission package

### Services

#### NeutralityDialService
Real-time NPOV scoring with word highlighting:
```typescript
const score = NeutralityDialService.calculateNPOVScore(text);
// Returns: { normalizedScore, thresholdStatus, highlightedTerms, feedback }
```

#### SourceCredibilityService
Validate source domains and prove notability:
```typescript
const source = await SourceCredibilityService.validateSource(url, title);
const { gngProven, validSources, message } = await SourceCredibilityService.validateNotability(sources);
```

#### CitationGeneratorService
Convert URLs to {{cite web}} wikitext:
```typescript
const citation = CitationGeneratorService.generateCitation({
  url: "https://example.com",
  title: "Article Title",
  authors: ["Author Name"],
  publicationDate: "2025-01-15"
});
```

#### WACWizardManager
Manage wizard state and validation:
```typescript
const manager = new WACWizardManager("Article Title");
await manager.updateStep1(sources);
const { success, validation } = await manager.nextStep();
const payload = manager.buildSubmissionPayload();
```

## 📖 Validation Rules

### Step 1: Notability Check
- ✅ Minimum 3 sources required
- ✅ Must be independent (not subject's own website)
- ✅ Must be reliable (high/medium tier domains)
- ✅ Must be verified (URL exists)

### Step 2: Lead & Infobox
- ✅ Lead section: 1-3 sentences
- ✅ Non-empty content

### Step 3: Citation Structure
- ✅ Each major section must have citations
- ✅ At least one reference in total

### Step 4: Content & NPOV
- ✅ Non-empty body content
- ✅ NPOV score below red threshold (0.05)

### Step 5: Review & Metadata
- ✅ All compliance checklist items completed
- ✅ Copyright confirmation
- ✅ Recommended: Categories added

### Step 6: Final Submission
- ✅ Draft title provided
- ✅ Complete wikitext ready

## 🔒 Legal & Licensing

The WACA project operates under the following legal and licensing commitments:

### 1. Tool Source Code
* **License:** The entire WACA source code is released under the **MIT License**. This is an OSI-approved, open-source license, fulfilling the requirements for all projects hosted on Wikimedia Toolforge.
* **Commitment:** By using WACA, developers and users are free to use, modify, and distribute the source code, provided the original copyright and license notice are included.

### 2. Contributed Content (Draft Articles)
* **License:** All text content created by users through WACA and submitted to the Wikipedia Draft space is automatically released under the **Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)** and the **GNU Free Documentation License (GFDL)**, as required by the Wikimedia Foundation's Terms of Use.
* **User Acknowledgement:** The submission step (Step 6) clearly informs users that their contribution is being made under this free license.

### 3. API Conduct
* **Transparency:** WACA adheres strictly to the Wikimedia API guidelines, ensuring all actions are clearly identifiable through the custom `WACA Metadata Tag` and the specific **Edit Summary**.
* **Rate Limits:** The tool is engineered to respect API rate limits and avoid overwhelming Wikimedia servers, ensuring a positive impact on the overall infrastructure.

## 🔍 Source Credibility Assessment

WACA implements a **tiered domain validation system** to enforce Wikipedia's **Verifiability** policy. Sources are classified into reliability tiers based on editorial oversight and independence standards.

### Source Tier Classification

| Tier | Score | Domain Indicators | Policy Alignment | Examples |
|------|-------|-------------------|------------------|----------|
| **High** | 3 | `.edu`, `.gov`, major newspapers | Reliable & Independent | `nytimes.com`, `bbc.co.uk`, `stanford.edu`, `fda.gov`, `nature.com` |
| **Medium** | 2 | Trade publications, established news | Reliable but potentially niche | `forbes.com`, `inc.com`, university research centers |
| **Low** | 1 | Social media, forums, blogs, press releases | Unreliable/Primary | `twitter.com`, `reddit.com`, `youtube.com`, press releases |
| **Unknown** | 0 | Newly registered, obscure hosting | Requires manual review | Treated as Low tier initially |

### Notability Validation Rules

WACA enforces the **General Notability Guideline (GNG)** by requiring:

| Rule | Requirement | Action if Failed |
|------|-------------|------------------|
| **Minimum Count** | ≥ 3 sources provided | Block Step 1: "Minimum of 3 sources required" |
| **Reliability Threshold** | ≥ 3 sources must be High/Medium tier | Block Step 1: "Sources must be reliable to prove notability" |
| **Independence Check** | Sources must be independent (not from subject or affiliates) | Warning flag in submission metadata |
| **No Primary Sources** | Official websites/press releases = Low tier | Prompt: "Official sources are Primary; cannot prove Notability" |

### Output Structure
```typescript
{
  gngProven: boolean,        // True only if all rules pass
  reliableCount: number,     // Count of High/Medium tier sources
  failedRule: string | null  // Describes first failed rule (for UI feedback)
}
```

---

## 🌍 Ghanaian & African Source Whitelisting

Ensuring WACA works effectively for topics relevant to Africa and Ghana requires explicit inclusion of authoritative regional and national sources in High/Medium Reliability Tiers.

### High Tier Whitelist (Score 3: Major Institutional/News)

| Category | Domain Examples | Rationale |
|----------|-----------------|-----------|
| **Ghanaian News** | `graphic.com.gh`, `ghanaweb.com`, `citinewsroom.com`, `myjoyonline.com`, `starrfm.com.gh` | Major, respected national news media |
| **Ghana Government** | `parliament.gh`, `.gov.gh` domains | Parliament and government agencies |
| **Ghanaian Universities** | `ug.edu.gh`, `knust.edu.gh`, `ucc.edu.gh`, `uew.edu.gh`, `uds.edu.gh` | Premier academic institutions |
| **African News** | `bbc.com/africa`, `reuters.com`, `allafrica.com` | International coverage focused on the continent |
| **International Academic** | `scholar.google.com`, `jstor.org`, established African think tanks | Research credibility across disciplines |

### Medium Tier Whitelist (Score 2: Regional/Reputable)

| Category | Examples | Rationale |
|----------|----------|-----------|
| **Regional Media** | Established local/regional African news outlets | Trusted local information source |
| **Think Tanks** | African policy research institutes, development organizations | Reliable for specific reports and analysis |
| **Trade Publications** | Industry-specific African publications | Niche but reputable expertise |

### Maintenance Strategy

1. **Initial Launch:** Start with 10-15 high-confidence Ghanaian/African domains
2. **Community Vetting:** Request **WikiProject Ghana** and **WikiProject Africa** to review and contribute domains
3. **Centralized Storage:** Maintain lists in `src/data/reliable_domains.json` for easy updates without code redeployment
4. **Feedback Mechanism:** Implement "Flag Source" button to crowdsource domain classification corrections
5. **Regular Updates:** Periodically review flagged domains and integrate community feedback

---

## 🧱 WACA Code Structure & Data Flow

### Service Architecture

The success of WACA depends on clean separation of concerns between the orchestrator (`WACWizardManager`), policy validators (`SourceCredibilityService`, `NeutralityDialService`), and presenters (UI components).

#### `src/services/wacWizardManager.ts` (The Orchestrator)
- **Responsibilities:**
  - Maintains single source of truth for draft data (`WACWizardState`)
  - Handles user input from components via `update*` methods
  - Calls external policy services for step validation
  - Builds final submission payload for Wikipedia API
- **Key Function Flow:**
  - `nextStep()` → `sourceCredibilityService.validateNotability()` (before Step 2)
  - `nextStep()` → `neutralityDialService.validateNPOV()` (before Step 5)
  - `nextStep()` → `wikipediaApi.submitDraft()` (at Step 6)

#### `src/services/sourceCredibilityService.ts` (The Verifiability Gatekeeper)
- **Responsibilities:**
  - Implement domain tier assessment logic (High/Medium/Low)
  - Enforce Notability Validation (`validateNotability()`) checking ≥3 reliable sources
  - Call `citationGeneratorService` to enrich sources with citation Wikitext
- **Data Flow:** Source URLs/titles → Boolean (`gngProven`) + enriched source objects with tier scores

#### `src/services/neutralityDialService.ts` (The NPOV Intelligence)
- **Responsibilities:**
  - Implement rules-based NLP engine with weighted lexicon
  - Provide real-time scoring for `Step4ContentNPOV.tsx`
  - Return both score and highlighting data for word-level visual feedback
- **Data Flow:** Article text → Numerical score (`normalizedScore`) + array of `highlightedTerms`

#### `src/services/citationGeneratorService.ts` (The Citation Builder)
- **Responsibilities:**
  - Convert source metadata to `{{cite web}}` Wikitext
  - Generate standard section headings
  - Wrap references in `<ref>` tags
- **Data Flow:** Citation metadata → Wikitext string

### Component-to-Service Example: Step 4 (Content & NPOV)

1. User types text into **`Step4ContentNPOV.tsx`**
2. Component calls `NeutralityDialService.calculateNPOVScore(text)` in real-time
3. Service returns score and highlighted terms array
4. Component updates:
   - Neutrality Dial color (Green/Yellow/Red)
   - Text highlighting for flagged words
   - Suggestions for neutral alternatives
5. User tries to proceed → `WACWizardManager` validates final score ≤ 0.05 before unlocking Step 5

### Data Model Overview

```typescript
WACWizardState {
  articleTitle: string
  currentStep: 1-6
  step1: NotabilityCheckData    // Sources with credibility tiers
  step2: LeadAndInfoboxData     // Lead text + infobox fields
  step3: CitationStructureData  // Sections + citations
  step4: ContentAndNPOVData     // Article body + NPOV score
  step5: ReviewAndMetadataData  // Policy checklist + categories
  step6: FinalSubmissionData    // Wikitext + submission ready
  completedSteps: number[]
  policyChecklist: Record<string, boolean>
}
```

---

## 📝 Contributing

