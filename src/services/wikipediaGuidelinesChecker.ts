// Wikipedia Guidelines Checker Service

import { GuidelineViolation, WIKIPEDIA_GUIDELINES } from '../types/guidelines';

export class WikipediaGuidelinesChecker {
  
  static checkContent(content: string): GuidelineViolation[] {
    const violations: GuidelineViolation[] = [];
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      // Check for NPOV violations
      violations.push(...this.checkNPOV(line, lineIndex));
      
      // Check for weasel words
      violations.push(...this.checkWeaselWords(line, lineIndex));
      
      // Check for peacock terms
      violations.push(...this.checkPeacockTerms(line, lineIndex));
      
      // Check for citation needs
      violations.push(...this.checkCitations(line, lineIndex));
      
      // Check for promotional language
      violations.push(...this.checkPromotionalLanguage(line, lineIndex));
      
      // Check for original research indicators
      violations.push(...this.checkOriginalResearch(line, lineIndex));
    });

    return violations;
  }

  private static checkNPOV(line: string, lineIndex: number): GuidelineViolation[] {
    const violations: GuidelineViolation[] = [];
    const npovGuideline = WIKIPEDIA_GUIDELINES.find(g => g.id === 'npov')!;
    
    const biasedPhrases = [
      { phrase: 'obviously', suggestion: 'Remove or provide evidence' },
      { phrase: 'clearly', suggestion: 'Remove or provide evidence' },
      { phrase: 'of course', suggestion: 'Remove unnecessary emphasis' },
      { phrase: 'naturally', suggestion: 'State facts without emphasis' },
      { phrase: 'undoubtedly', suggestion: 'Use neutral language' },
      { phrase: 'without a doubt', suggestion: 'Use neutral language' }
    ];

    biasedPhrases.forEach(({ phrase, suggestion }) => {
      if (line.toLowerCase().includes(phrase)) {
        violations.push({
          guideline: npovGuideline,
          location: { line: lineIndex + 1, text: line },
          message: `Biased phrase detected: "${phrase}"`,
          suggestion
        });
      }
    });

    return violations;
  }

  private static checkWeaselWords(line: string, lineIndex: number): GuidelineViolation[] {
    const violations: GuidelineViolation[] = [];
    const weaselGuideline = WIKIPEDIA_GUIDELINES.find(g => g.id === 'weasel-words')!;
    
    const weaselPhrases = [
      'some people',
      'many believe',
      'it is said',
      'it is believed',
      'some say',
      'critics say',
      'experts claim',
      'arguably',
      'it has been said',
      'widely regarded',
      'considered by many'
    ];

    weaselPhrases.forEach(phrase => {
      if (line.toLowerCase().includes(phrase)) {
        violations.push({
          guideline: weaselGuideline,
          location: { line: lineIndex + 1, text: line },
          message: `Weasel word detected: "${phrase}"`,
          suggestion: 'Specify who says this with a citation, or remove the claim'
        });
      }
    });

    return violations;
  }

  private static checkPeacockTerms(line: string, lineIndex: number): GuidelineViolation[] {
    const violations: GuidelineViolation[] = [];
    const peacockGuideline = WIKIPEDIA_GUIDELINES.find(g => g.id === 'peacock-terms')!;
    
    const peacockTerms = [
      'legendary',
      'iconic',
      'world-famous',
      'world-renowned',
      'best',
      'greatest',
      'most important',
      'leading',
      'premier',
      'top',
      'prestigious',
      'acclaimed',
      'celebrated',
      'renowned',
      'groundbreaking',
      'revolutionary',
      'innovative'
    ];

    peacockTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(line)) {
        violations.push({
          guideline: peacockGuideline,
          location: { line: lineIndex + 1, text: line },
          message: `Peacock term detected: "${term}"`,
          suggestion: 'Use neutral, factual language with citations'
        });
      }
    });

    return violations;
  }

  private static checkCitations(line: string, lineIndex: number): GuidelineViolation[] {
    const violations: GuidelineViolation[] = [];
    const citeGuideline = WIKIPEDIA_GUIDELINES.find(g => g.id === 'citing-sources')!;
    
    // Skip if line is too short or is a heading
    if (line.length < 50 || line.trim().startsWith('==')) {
      return violations;
    }

    // Check if line has citations
    const hasCitation = /<ref|<\/ref>|\[\d+\]/.test(line);
    
    // Check for factual claims that need citations
    const needsCitationPatterns = [
      /\b(was|were|is|are)\s+(born|founded|established|created|discovered)/i,
      /\b\d{4}\b/, // Years
      /\baccording to\b/i,
      /\bstudies? (show|indicate|suggest)/i,
      /\bresearch (shows|indicates|suggests)/i,
      /\bstatistics\b/i,
      /\bdata (shows|indicates|suggests)/i
    ];

    const needsCitation = needsCitationPatterns.some(pattern => pattern.test(line));
    
    if (needsCitation && !hasCitation) {
      violations.push({
        guideline: citeGuideline,
        location: { line: lineIndex + 1, text: line },
        message: 'This statement likely needs a citation',
        suggestion: 'Add <ref>reliable source</ref> after factual claims'
      });
    }

    return violations;
  }

  private static checkPromotionalLanguage(line: string, lineIndex: number): GuidelineViolation[] {
    const violations: GuidelineViolation[] = [];
    const npovGuideline = WIKIPEDIA_GUIDELINES.find(g => g.id === 'npov')!;
    
    const promotionalPhrases = [
      'cutting-edge',
      'state-of-the-art',
      'world-class',
      'industry-leading',
      'award-winning',
      'unparalleled',
      'unmatched',
      'superior',
      'excellent',
      'outstanding',
      'exceptional',
      'remarkable'
    ];

    promotionalPhrases.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'i');
      if (regex.test(line)) {
        violations.push({
          guideline: npovGuideline,
          location: { line: lineIndex + 1, text: line },
          message: `Promotional language detected: "${phrase}"`,
          suggestion: 'Use neutral, encyclopedic language'
        });
      }
    });

    return violations;
  }

  private static checkOriginalResearch(line: string, lineIndex: number): GuidelineViolation[] {
    const violations: GuidelineViolation[] = [];
    const norGuideline = WIKIPEDIA_GUIDELINES.find(g => g.id === 'no-original-research')!;
    
    const orIndicators = [
      'in my opinion',
      'i believe',
      'i think',
      'we can conclude',
      'this proves',
      'this shows that',
      'therefore',
      'thus we see',
      'it follows that'
    ];

    orIndicators.forEach(indicator => {
      if (line.toLowerCase().includes(indicator)) {
        violations.push({
          guideline: norGuideline,
          location: { line: lineIndex + 1, text: line },
          message: `Possible original research: "${indicator}"`,
          suggestion: 'Only include information that can be verified in reliable sources'
        });
      }
    });

    return violations;
  }

  static generateComplianceReport(content: string): {
    score: number;
    violations: GuidelineViolation[];
    summary: {
      critical: number;
      important: number;
      recommended: number;
    };
    recommendations: string[];
  } {
    const violations = this.checkContent(content);
    
    const summary = {
      critical: violations.filter(v => v.guideline.severity === 'critical').length,
      important: violations.filter(v => v.guideline.severity === 'important').length,
      recommended: violations.filter(v => v.guideline.severity === 'recommended').length
    };

    // Calculate compliance score
    let score = 100;
    score -= summary.critical * 10;
    score -= summary.important * 5;
    score -= summary.recommended * 2;
    score = Math.max(0, score);

    const recommendations: string[] = [];
    
    if (summary.critical > 0) {
      recommendations.push('⚠️ Address critical policy violations immediately');
    }
    if (summary.important > 5) {
      recommendations.push('📝 Review and fix important style issues');
    }
    if (!content.includes('<ref')) {
      recommendations.push('📚 Add citations to verify your claims');
    }
    if (!content.includes('==')) {
      recommendations.push('📑 Organize content with section headings');
    }

    return {
      score,
      violations,
      summary,
      recommendations
    };
  }
}
