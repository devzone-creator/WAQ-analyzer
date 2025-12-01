/**
 * WACA Wizard Manager Service
 * Manages wizard state, validation, and progression through 6 steps
 * Ensures stateful enforcement of validation before proceeding
 */

import {
  WACWizardState,
  StepValidationResult,
  AfCSubmissionPayload,
  WACMetadataTag,
  Source
} from '../types/waca';
import { SourceCredibilityService } from './sourceCredibilityService';
import { NeutralityDialService } from './neutralityDialService';

export class WACWizardManager {
  private state: WACWizardState;

  constructor(articleTitle: string, language: string = 'en') {
    const now = new Date();
    this.state = {
      currentStep: 1,
      completedSteps: [],
      articleTitle,
      language,
      createdAt: now,
      lastModified: now,

      step1: {
        sources: [],
        gngProven: false,
        validationMessage: ''
      },
      step2: {
        leadText: '',
        leadSentences: 0,
        infoboxFields: {},
        infoboxWikitext: '',
        isValid: false
      },
      step3: {
        sections: [],
        totalReferences: 0,
        allSectionsHaveCitations: false,
        wikitext: ''
      },
      step4: {
        bodyContent: '',
        npovScore: {
          rawScore: 0,
          normalizedScore: 0,
          wordCount: 0,
          thresholdStatus: 'green',
          highlightedTerms: [],
          feedback: '',
          canProceed: true
        }
      },
      step5: {
        policyChecklist: this.initializePolicyChecklist(),
        allChecklistItemsCompleted: false,
        userDeclaredCOI: false,
        suggestedCategories: [],
        selectedCategories: [],
        copyrightConfirmed: false
      },
      step6: {
        draftTitle: '',
        completeWikitext: '',
        editSummary: 'Creating new draft via WACA Tool (v1.0)',
        submitToWikipedia: false
      }
    };
  }

  /**
   * Initialize policy compliance checklist
   */
  private initializePolicyChecklist() {
    return [
      {
        id: 'npov',
        label: 'NPOV (Neutral Point of View)',
        description: 'Article maintains neutral point of view, not promotional',
        checked: false
      },
      {
        id: 'notability',
        label: 'Notability',
        description: 'Subject meets Wikipedia notability guidelines',
        checked: false
      },
      {
        id: 'citations',
        label: 'Citations',
        description: 'Adequate reliable sources cited throughout',
        checked: false
      },
      {
        id: 'formatting',
        label: 'Formatting',
        description: 'Article follows Wikipedia formatting guidelines',
        checked: false
      },
      {
        id: 'coi',
        label: 'Conflict of Interest',
        description: 'Disclosed any potential conflict of interest',
        checked: false
      },
      {
        id: 'copyright',
        label: 'Copyright',
        description: 'Content is original or properly attributed',
        checked: false
      }
    ];
  }

  /**
   * Get current state
   */
  getState(): WACWizardState {
    return { ...this.state };
  }

  /**
   * Validate and move to next step
   */
  async nextStep(): Promise<{
    success: boolean;
    validation: StepValidationResult;
  }> {
    const validation = await this.validateCurrentStep();

    if (validation.isValid && validation.canProceed) {
      // Add current step to completedSteps array if not already present
      if (!this.state.completedSteps.includes(this.state.currentStep)) {
        this.state.completedSteps.push(this.state.currentStep);
      }
      const nextStep = (this.state.currentStep + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      if (nextStep <= 6) {
        this.state.currentStep = nextStep;
        this.state.lastModified = new Date();
      }
      return { success: true, validation };
    }

    return { success: false, validation };
  }

  /**
   * Go to previous step
   */
  previousStep(): boolean {
    if (this.state.currentStep > 1) {
      this.state.currentStep = (this.state.currentStep - 1) as 1 | 2 | 3 | 4 | 5 | 6;
      this.state.lastModified = new Date();
      return true;
    }
    return false;
  }

  /**
   * Validate current step
   */
  private async validateCurrentStep(): Promise<StepValidationResult> {
    switch (this.state.currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      case 3:
        return this.validateStep3();
      case 4:
        return this.validateStep4();
      case 5:
        return this.validateStep5();
      case 6:
        return this.validateStep6();
      default:
        return {
          isValid: false,
          errors: ['Invalid step'],
          warnings: [],
          canProceed: false
        };
    }
  }

  /**
   * Step 1: Notability Check
   */
  validateStep1(): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (this.state.step1.sources.length < 3) {
      errors.push(
        `Need ${3 - this.state.step1.sources.length} more sources (minimum 3 required)`
      );
    }

    if (!this.state.step1.gngProven) {
      errors.push(
        'Sources do not prove notability under General Notability Guideline'
      );
    }

    const unreliableSources = this.state.step1.sources.filter(s => !s.isReliable);
    if (unreliableSources.length > 0) {
      warnings.push(
        `${unreliableSources.length} source(s) are not reliable. Use independent, published sources only.`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0
    };
  }

  /**
   * Step 2: Lead & Infobox
   */
  validateStep2(): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.state.step2.leadText || this.state.step2.leadText.trim().length === 0) {
      errors.push('Lead section cannot be empty');
    }

    if (
      this.state.step2.leadSentences < 1 ||
      this.state.step2.leadSentences > 3
    ) {
      errors.push('Lead must be 1-3 sentences');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0
    };
  }

  /**
   * Step 3: Citation Structure
   */
  validateStep3(): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (this.state.step3.sections.length === 0) {
      errors.push('No sections defined');
    }

    const sectionsWithoutCitations = this.state.step3.sections.filter(
      s => s.citations.length === 0
    );

    if (sectionsWithoutCitations.length > 0) {
      errors.push(
        `${sectionsWithoutCitations.length} section(s) missing citations. Each major section needs at least one reference.`
      );
    }

    if (this.state.step3.totalReferences < 3) {
      warnings.push('Consider adding more references to strengthen the article');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0
    };
  }

  /**
   * Step 4: Content & NPOV
   */
  validateStep4(): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (
      !this.state.step4.bodyContent ||
      this.state.step4.bodyContent.trim().length === 0
    ) {
      errors.push('Body content cannot be empty');
    }

    // Check neutrality score
    if (this.state.step4.npovScore.thresholdStatus === 'red') {
      errors.push(
        'Content violates NPOV policy. Replace promotional terms before proceeding.'
      );
    }

    if (this.state.step4.npovScore.thresholdStatus === 'yellow') {
      warnings.push(
        'Content has subjective language. Consider revising for stronger neutrality.'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0
    };
  }

  /**
   * Step 5: Review & Metadata
   */
  validateStep5(): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.state.step5.allChecklistItemsCompleted) {
      const unchecked = this.state.step5.policyChecklist
        .filter(item => !item.checked)
        .map(item => item.label);
      errors.push(
        `Complete all compliance checks: ${unchecked.join(', ')}`
      );
    }

    if (!this.state.step5.copyrightConfirmed) {
      errors.push('Must confirm content is original or properly attributed');
    }

    if (this.state.step5.selectedCategories.length === 0) {
      warnings.push('Consider adding article categories for better organization');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0
    };
  }

  /**
   * Step 6: Final Submission
   */
  validateStep6(): StepValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.state.step6.draftTitle || this.state.step6.draftTitle.trim().length === 0) {
      errors.push('Draft title cannot be empty');
    }

    if (
      !this.state.step6.completeWikitext ||
      this.state.step6.completeWikitext.trim().length === 0
    ) {
      errors.push('Article wikitext cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canProceed: errors.length === 0
    };
  }

  /**
   * Update Step 1: Notability Check
   */
  async updateStep1(sources: Source[]): Promise<void> {
    this.state.step1.sources = sources;
    const validation = await SourceCredibilityService.validateNotability(sources);
    this.state.step1.gngProven = validation.gngProven;
    this.state.step1.validationMessage = validation.message;
    this.state.lastModified = new Date();
  }

  /**
   * Update Step 2: Lead & Infobox
   */
  updateStep2(lead: string, infoboxWikitext: string): void {
    this.state.step2.leadText = lead;
    this.state.step2.leadSentences = lead
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0).length;
    this.state.step2.infoboxWikitext = infoboxWikitext;
    this.state.step2.isValid = true;
    this.state.lastModified = new Date();
  }

  /**
   * Update Step 3: Citation Structure
   */
  updateStep3(wikitext: string): void {
    // Parse sections from wikitext
    const sections = wikitext
      .split(/^==/m)
      .filter(s => s.trim().length > 0)
      .map(s => ({
        heading: s.split('==')[0]?.trim() || 'Untitled',
        content: s,
        citations: (s.match(/<ref>/g) || []).map((_: string, i: number) => ({
          url: '',
          title: `Citation ${i + 1}`,
          authors: [],
          wikitext: ''
        })),
        isValid: true
      }));

    this.state.step3.sections = sections;
    this.state.step3.totalReferences = sections.reduce(
      (sum, s) => sum + s.citations.length,
      0
    );
    this.state.step3.allSectionsHaveCitations = sections.every(
      s => s.citations.length > 0
    );
    this.state.step3.wikitext = wikitext;
    this.state.lastModified = new Date();
  }

  /**
   * Update Step 4: Content & NPOV
   */
  updateStep4(bodyContent: string): void {
    this.state.step4.bodyContent = bodyContent;
    this.state.step4.npovScore = NeutralityDialService.calculateNPOVScore(
      bodyContent
    );
    this.state.lastModified = new Date();
  }

  /**
   * Update Step 5: Review & Metadata
   */
  updateStep5(checklist: boolean[], coi: boolean, categories: string[]): void {
    this.state.step5.policyChecklist.forEach((item, index) => {
      item.checked = checklist[index] || false;
    });
    this.state.step5.allChecklistItemsCompleted = checklist.every(c => c);
    this.state.step5.userDeclaredCOI = coi;
    this.state.step5.selectedCategories = categories;
    this.state.step5.copyrightConfirmed = true;
    this.state.lastModified = new Date();
  }

  /**
   * Build final submission payload
   */
  buildSubmissionPayload(): AfCSubmissionPayload {
    // Build metadata tag
    const wacMetadata: WACMetadataTag = {
      version: '1.0',
      npovScoreFinal: this.state.step4.npovScore.normalizedScore,
      coreSources: this.state.step1.sources
        .slice(0, 3)
        .map(s => s.url),
      userDeclaredCOI: this.state.step5.userDeclaredCOI
    };

    // Build complete wikitext
    const parts: string[] = [];

    // AfC template at top
    parts.push('{{subst:submit}}');
    parts.push('');

    // WACA metadata tag (hidden)
    parts.push(
      `{{User:WACA/Tool-Tag\n| version = ${wacMetadata.version}\n| npo_score_final = ${wacMetadata.npovScoreFinal}\n| core_sources_1 = ${wacMetadata.coreSources[0] || 'N/A'}\n| user_declared_coi = ${wacMetadata.userDeclaredCOI ? 'YES' : 'NO'}\n}}`
    );
    parts.push('');

    // Main content
    parts.push(this.state.step2.infoboxWikitext);
    parts.push('');
    parts.push(`'''${this.state.step2.leadText}'''`);
    parts.push('');
    parts.push(this.state.step4.bodyContent);
    parts.push('');
    parts.push(this.state.step3.wikitext);
    parts.push('');

    // Categories
    if (this.state.step5.selectedCategories.length > 0) {
      this.state.step5.selectedCategories.forEach(cat => {
        parts.push(`[[Category:${cat}]]`);
      });
    }

    const completeWikitext = parts.join('\n');

    return {
      draftTitle: `Draft:${this.state.step6.draftTitle}`,
      mainWikitext: completeWikitext,
      afcTemplate: '{{subst:submit}}',
      wacMetadataTag: wacMetadata,
      editSummary: this.state.step6.editSummary,
      user: 'WACA-User',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if wizard is complete
   */
  isComplete(): boolean {
    return this.state.completedSteps.length === 6;
  }

  /**
   * Reset wizard
   */
  reset(): void {
    const now = new Date();
    this.state = {
      currentStep: 1,
      completedSteps: [],
      articleTitle: this.state.articleTitle,
      language: this.state.language,
      createdAt: now,
      lastModified: now,
      step1: {
        sources: [],
        gngProven: false,
        validationMessage: ''
      },
      step2: {
        leadText: '',
        leadSentences: 0,
        infoboxFields: {},
        infoboxWikitext: '',
        isValid: false
      },
      step3: {
        sections: [],
        totalReferences: 0,
        allSectionsHaveCitations: false,
        wikitext: ''
      },
      step4: {
        bodyContent: '',
        npovScore: {
          rawScore: 0,
          normalizedScore: 0,
          wordCount: 0,
          thresholdStatus: 'green',
          highlightedTerms: [],
          feedback: '',
          canProceed: true
        }
      },
      step5: {
        policyChecklist: this.initializePolicyChecklist(),
        allChecklistItemsCompleted: false,
        userDeclaredCOI: false,
        suggestedCategories: [],
        selectedCategories: [],
        copyrightConfirmed: false
      },
      step6: {
        draftTitle: '',
        completeWikitext: '',
        editSummary: 'Creating new draft via WACA Tool (v1.0)',
        submitToWikipedia: false
      }
    };
  }
}
