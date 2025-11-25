# WACA - Wikipedia Article Creation Assistant

A policy-enforcing, guided **6-step wizard** for creating Wikipedia article drafts compliant with Articles for Creation (AfC) standards. WACA dramatically lowers the entry barrier for new editors by preventing common submission errors (Notability, NPOV, Formatting) and ensuring every submitted draft meets minimum quality requirements.

## 🎯 Core Features

### 6-Step Wizard Flow
1. **Notability Check** - Validate 3+ independent reliable sources proving GNG (General Notability Guideline)
2. **Lead & Infobox** - Draft article definition (1-3 sentences) with Infobox templates
3. **Citation Structure** - Add references and auto-generate standard section headings
4. **Content & NPOV** - Real-time Neutrality Dial with promotional term highlighting
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

**License**: MIT (OSI-approved, open-source)

This tool respects Wikipedia API rate limits and identifies all actions through Edit Summary and metadata tags as required by Toolforge terms of service.

## 🎓 Wikipedia Policies

WACA enforces compliance with:
- **General Notability Guideline (GNG)** - Via Step 1 source validation
- **Neutral Point of View (NPOV)** - Via Step 4 Neutrality Dial
- **Verifiability** - Via citation structure validation
- **No Original Research (NOR)** - Via source requirement emphasis

## 📝 Contributing

