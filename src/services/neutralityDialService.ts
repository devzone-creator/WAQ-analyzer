/**
 * Neutrality Dial Service (NPOV Scoring)
 * Real-time, rules-based NLP scoring mechanism for promotional density measurement
 * Formula: S_NPOV = S_raw / W (where S_raw = sum of term weights, W = word count)
 */

import { NPOVLexicon, NPOVScore, HighlightedTerm } from '../types/waca';

export class NeutralityDialService {
  // Weights: High (3), Medium (2), Negative (-1)
  private static readonly DEFAULT_LEXICON: NPOVLexicon = {
    high: [
      // 3 points - Clear policy violations
      'groundbreaking',
      'revolutionary',
      'best-in-class',
      'world-leading',
      'industry-leading',
      'market-leading',
      'pioneering',
      'unprecedented',
      'unparalleled',
      'incomparable',
      'exceptional',
      'remarkable',
      'outstanding',
      'extraordinary',
      'spectacular',
      'phenomenal',
      'stunning',
      'awe-inspiring',
      'iconic',
      'legendary',
      'unique',
      'one-of-a-kind',
      'next-generation',
      'state-of-the-art',
      'cutting-edge'
    ],
    medium: [
      // 2 points - Subjective language
      'leading',
      'innovative',
      'successful',
      'popular',
      'well-known',
      'famous',
      'acclaimed',
      'award-winning',
      'prestigious',
      'prominent',
      'distinguished',
      'celebrated',
      'praised',
      'admired',
      'respected',
      'renowned',
      'influential',
      'important',
      'significant',
      'notable',
      'impressive',
      'excellent',
      'superior',
      'advanced',
      'modern',
      'effective',
      'powerful'
    ],
    negative: [
      // -1 point - Neutralizers (attribute markers - discourage their use but they're neutral)
      'according to',
      'sources report',
      'has been',
      'has claimed',
      'reportedly',
      'allegedly',
      'claims',
      'argued',
      'contends',
      'states',
      'says',
      'reports',
      'suggests',
      'indicates',
      'demonstrates',
      'shows',
      'research shows',
      'studies indicate',
      'evidence suggests'
    ]
  };

  /**
   * Calculate NPOV score for given text
   * Returns normalized score with threshold status and highlighted terms
   */
  static calculateNPOVScore(
    text: string,
    lexicon?: NPOVLexicon
  ): NPOVScore {
    const activeLexicon = lexicon || this.DEFAULT_LEXICON;
    const normalizedText = text.toLowerCase();
    const words = this.tokenizeWords(text);
    const wordCount = words.length;

    let rawScore = 0;
    const highlightedTerms: HighlightedTerm[] = [];

    // Process high-weight terms (3 points)
    for (const term of activeLexicon.high) {
      const regex = this.createTermRegex(term);
      const matches = this.findAllMatches(normalizedText, regex);
      for (const match of matches) {
        rawScore += 3;
        highlightedTerms.push({
          term,
          weight: 3,
          position: match.index,
          length: term.length
        });
      }
    }

    // Process medium-weight terms (2 points)
    for (const term of activeLexicon.medium) {
      const regex = this.createTermRegex(term);
      const matches = this.findAllMatches(normalizedText, regex);
      for (const match of matches) {
        rawScore += 2;
        highlightedTerms.push({
          term,
          weight: 2,
          position: match.index,
          length: term.length
        });
      }
    }

    // Process negative terms (-1 point - discourage use)
    for (const term of activeLexicon.negative) {
      const regex = this.createTermRegex(term);
      const matches = this.findAllMatches(normalizedText, regex);
      for (const match of matches) {
        rawScore -= 1;
        highlightedTerms.push({
          term,
          weight: -1,
          position: match.index,
          length: term.length
        });
      }
    }

    // Calculate normalized score
    const normalizedScore = wordCount > 0 ? rawScore / wordCount : 0;

    // Determine threshold status
    let thresholdStatus: 'green' | 'yellow' | 'red';
    if (normalizedScore <= 0.02) {
      thresholdStatus = 'green';
    } else if (normalizedScore <= 0.05) {
      thresholdStatus = 'yellow';
    } else {
      thresholdStatus = 'red';
    }

    // Generate feedback
    const feedback = this.generateFeedback(normalizedScore, thresholdStatus);

    return {
      rawScore,
      normalizedScore: parseFloat(normalizedScore.toFixed(6)),
      wordCount,
      thresholdStatus,
      highlightedTerms: this.deduplicateTerms(highlightedTerms),
      feedback,
      canProceed: thresholdStatus !== 'red' // Red is soft gate blocking Step 5
    };
  }

  /**
   * Generate human-readable feedback based on score and threshold
   */
  private static generateFeedback(
    _score: number,
    status: 'green' | 'yellow' | 'red'
  ): string {
    switch (status) {
      case 'green':
        return 'Excellent! Your content maintains strong neutral point of view (NPOV). You may proceed to submission.';
      case 'yellow':
        return 'Caution: Your content contains some subjective language. Consider replacing highlighted terms with more neutral alternatives. You may proceed but reviewers may request revisions.';
      case 'red':
        return 'Critical Alert: Your content contains excessive promotional language that violates NPOV policy. You must revise the content before submission. Replace highlighted terms with neutral language.';
      default:
        return 'Unable to determine content neutrality.';
    }
  }

  /**
   * Tokenize text into words
   */
  private static tokenizeWords(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Create regex for term matching (word boundary)
   */
  private static createTermRegex(term: string): RegExp {
    // Escape special regex characters and match whole words
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'gi');
  }

  /**
   * Find all matches of regex in text
   */
  private static findAllMatches(
    text: string,
    regex: RegExp
  ): Array<{ index: number }> {
    const matches: Array<{ index: number }> = [];
    let match;
    // Reset regex
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      matches.push({ index: match.index });
    }
    return matches;
  }

  /**
   * Deduplicate terms at same position (keep highest weight)
   */
  private static deduplicateTerms(
    terms: HighlightedTerm[]
  ): HighlightedTerm[] {
    const positionMap = new Map<number, HighlightedTerm>();

    for (const term of terms) {
      const existing = positionMap.get(term.position);
      if (!existing || Math.abs(term.weight) > Math.abs(existing.weight)) {
        positionMap.set(term.position, term);
      }
    }

    return Array.from(positionMap.values()).sort(
      (a, b) => a.position - b.position
    );
  }

  /**
   * Get suggestions for replacing promotional terms
   */
  static getSuggestions(term: string): string[] {
    const suggestionMap: Record<string, string[]> = {
      groundbreaking: ['novel', 'new', 'distinctive'],
      revolutionary: ['significant', 'important', 'notable'],
      'best-in-class': ['leading', 'prominent'],
      pioneering: ['early', 'first', 'initial'],
      unprecedented: ['unusual', 'distinctive', 'notable'],
      leading: ['prominent', 'notable'],
      innovative: ['new', 'novel', 'distinctive'],
      successful: ['effective', 'functional'],
      exceptional: ['notable', 'important'],
      remarkable: ['notable', 'distinctive'],
      outstanding: ['notable', 'prominent'],
      'world-leading': ['major', 'significant'],
      iconic: ['well-known', 'famous', 'notable'],
      legendary: ['well-known', 'famous', 'noted'],
      unique: ['distinctive', 'notable', 'particular']
    };

    return suggestionMap[term.toLowerCase()] || ['Consider using more neutral language'];
  }

  /**
   * Custom lexicon builder - allow users to add domain-specific terms
   */
  static extendLexicon(
    baseLexicon: NPOVLexicon,
    customTerms: {
      high?: string[];
      medium?: string[];
      negative?: string[];
    }
  ): NPOVLexicon {
    return {
      high: [...baseLexicon.high, ...(customTerms.high || [])],
      medium: [...baseLexicon.medium, ...(customTerms.medium || [])],
      negative: [...baseLexicon.negative, ...(customTerms.negative || [])]
    };
  }
}
