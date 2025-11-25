/**
 * WACA (Wikipedia Article Creation Assistant) Core Types
 * Policy-enforcing 6-step wizard for AfC (Articles for Creation) submissions
 */

// Step 1: Notability Check - Source Validation
export interface Source {
  url: string;
  title: string;
  domain: string;
  credibilityTier: 'high' | 'medium' | 'low' | 'unknown';
  isIndependent: boolean;
  isReliable: boolean;
  verified: boolean;
  verificationError?: string;
}

export interface NotabilityCheckData {
  sources: Source[];
  gngProven: boolean;
  validationMessage: string;
}

// Step 2: Lead & Infobox
export interface LeadAndInfoboxData {
  leadText: string;
  leadSentences: number; // 1-3 required
  infoboxFields: Record<string, string>;
  infoboxWikitext: string;
  isValid: boolean;
}

// Step 3: Citation Structure
export interface Citation {
  url: string;
  title: string;
  authors: string[];
  publicationDate?: string;
  wikitext: string;
}

export interface WikiSection {
  heading: string;
  content: string;
  citations: Citation[];
  isValid: boolean;
}

export interface CitationStructureData {
  sections: WikiSection[];
  totalReferences: number;
  allSectionsHaveCitations: boolean;
  wikitext: string;
}

// Step 4: Content & NPOV - Neutrality Dial
export interface NPOVLexicon {
  high: string[]; // Weight: 3 pts - Clear violations
  medium: string[]; // Weight: 2 pts - Subjective language
  negative: string[]; // Weight: -1 pt - Neutralizers (attribution markers)
}

export interface NPOVScore {
  rawScore: number;
  normalizedScore: number; // S_NPOV = S_raw / W (word count)
  wordCount: number;
  thresholdStatus: 'green' | 'yellow' | 'red';
  highlightedTerms: HighlightedTerm[];
  feedback: string;
  canProceed: boolean; // Red threshold blocks Step 5 (soft gate)
}

export interface HighlightedTerm {
  term: string;
  weight: number;
  position: number; // Character position in text
  length: number;
}

export interface ContentAndNPOVData {
  bodyContent: string;
  npovScore: NPOVScore;
}

// Step 5: Review & Metadata
export interface PolicyComplianceChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

export interface ReviewAndMetadataData {
  policyChecklist: PolicyComplianceChecklistItem[];
  allChecklistItemsCompleted: boolean;
  userDeclaredCOI: boolean;
  suggestedCategories: string[];
  selectedCategories: string[];
  copyrightConfirmed: boolean;
}

// Step 6: Final Submission
export interface FinalSubmissionData {
  draftTitle: string;
  completeWikitext: string;
  editSummary: string;
  submitToWikipedia: boolean;
  submissionStatus?: 'pending' | 'success' | 'error';
  submissionError?: string;
}

// WACA Metadata Tag - Embedded in final wikitext
export interface WACMetadataTag {
  version: string;
  npovScoreFinal: number;
  coreSources: string[]; // URLs/Titles of source 1, 2, 3+
  userDeclaredCOI: boolean;
}

// Complete Wizard State
export interface WACWizardState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  completedSteps: Set<number>;
  
  // Step data
  step1: NotabilityCheckData;
  step2: LeadAndInfoboxData;
  step3: CitationStructureData;
  step4: ContentAndNPOVData;
  step5: ReviewAndMetadataData;
  step6: FinalSubmissionData;
  
  // Global state
  articleTitle: string;
  language: string;
  createdAt: Date;
  lastModified: Date;
}

// Validation Results
export interface StepValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
}

// AfC Submission Payload
export interface AfCSubmissionPayload {
  draftTitle: string;
  mainWikitext: string;
  afcTemplate: string; // {{subst:submit}}
  wacMetadataTag: WACMetadataTag;
  editSummary: string; // "Creating new draft via WACA Tool (v1.0)"
  user: string;
  timestamp: string;
}
