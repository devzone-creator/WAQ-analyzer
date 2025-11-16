// AtiQr Training Analyzer Service

import { CorrectionItem } from '../types/training';
import { WikipediaGuidelinesChecker } from './wikipediaGuidelinesChecker';
import { GuidelineViolation } from '../types/guidelines';

export class TrainingAnalyzer {
  
  static analyzeForTraining(text: string, language: string = 'en'): CorrectionItem[] {
    const violations = WikipediaGuidelinesChecker.checkContent(text);
    return this.convertToCorrections(violations, text);
  }

  private static convertToCorrections(
    violations: GuidelineViolation[],
    originalText: string
  ): CorrectionItem[] {
    return violations.map(violation => {
      const correction: CorrectionItem = {
        type: violation.guideline.severity === 'critical' ? 'error' : 
              violation.guideline.severity === 'important' ? 'warning' : 'suggestion',
        category: this.mapCategory(violation.guideline.id),
        line: violation.location.line,
        originalText: this.extractProblematicText(violation),
        correctedText: this.generateCorrection(violation),
        explanation: violation.message,
        guidelineLink: `https://en.wikipedia.org/wiki/Wikipedia:${violation.guideline.id.toUpperCase().replace(/-/g, '_')}`,
        severity: violation.guideline.severity
      };
      return correction;
    });
  }

  private static mapCategory(guidelineId: string): CorrectionItem['category'] {
    if (guidelineId.includes('cite') || guidelineId.includes('verif')) return 'citation';
    if (guidelineId.includes('npov')) return 'npov';
    if (guidelineId.includes('weasel')) return 'weasel';
    if (guidelineId.includes('peacock')) return 'peacock';
    if (guidelineId.includes('structure')) return 'structure';
    return 'style';
  }

  private static extractProblematicText(violation: GuidelineViolation): string {
    // Extract the specific problematic phrase from the message
    const match = violation.message.match(/"([^"]+)"/);
    return match ? match[1] : '';
  }

  private static generateCorrection(violation: GuidelineViolation): string {
    const problematicText = this.extractProblematicText(violation);
    
    // Generate corrections based on violation type
    if (violation.guideline.id === 'peacock-terms') {
      return '[needs neutral description with citation]';
    }
    if (violation.guideline.id === 'weasel-words') {
      return '[specify who with citation]';
    }
    if (violation.guideline.id === 'npov') {
      const biasedWords = ['obviously', 'clearly', 'of course', 'naturally'];
      if (biasedWords.some(word => problematicText.toLowerCase().includes(word))) {
        return ''; // Remove these words
      }
    }
    if (violation.guideline.id === 'citing-sources') {
      return violation.location.text + '<ref>citation needed</ref>';
    }
    
    return problematicText; // Default: keep original
  }

  static generateLearningPoints(corrections: CorrectionItem[]): string[] {
    const points: string[] = [];
    const categories = new Set(corrections.map(c => c.category));

    if (categories.has('citation')) {
      points.push('📚 Remember to cite your sources! Every factual claim needs a reliable reference.');
    }
    if (categories.has('npov')) {
      points.push('⚖️ Keep your writing neutral. Avoid words like "clearly" or "obviously" that show bias.');
    }
    if (categories.has('peacock')) {
      points.push('🦚 Avoid promotional language. Instead of "legendary" or "best", use factual descriptions.');
    }
    if (categories.has('weasel')) {
      points.push('🎯 Be specific! Replace "some people say" with "According to [source]".');
    }

    const criticalCount = corrections.filter(c => c.severity === 'critical').length;
    if (criticalCount > 0) {
      points.push(`⚠️ You have ${criticalCount} critical issue(s) that violate core Wikipedia policies.`);
    }

    return points;
  }

  static async analyzeWikipediaArticle(articleUrl: string): Promise<{
    text: string;
    corrections: CorrectionItem[];
    learningPoints: string[];
    isGoodExample: boolean;
  }> {
    // Extract article title from URL
    const titleMatch = articleUrl.match(/wiki\/([^#?]+)/);
    if (!titleMatch) {
      throw new Error('Invalid Wikipedia URL');
    }

    const title = decodeURIComponent(titleMatch[1]);
    
    // Fetch article content
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/html/${title}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }

    const html = await response.text();
    
    // Simple HTML to text conversion (in production, use a proper parser)
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000); // Limit to first 5000 chars

    const corrections = this.analyzeForTraining(text);
    const learningPoints = this.generateLearningPoints(corrections);
    const isGoodExample = corrections.filter(c => c.severity === 'critical').length === 0;

    return {
      text,
      corrections,
      learningPoints,
      isGoodExample
    };
  }
}
