// AI Service - Core AI functionality for AtiQr
export interface AIAnalysisResult {
  qualityScore: number;
  biasScore: number;
  readabilityScore: number;
  suggestions: AISuggestion[];
  biasedPhrases: BiasDetection[];
  improvements: TextImprovement[];
}

export interface AISuggestion {
  type: 'citation' | 'style' | 'structure' | 'neutrality';
  priority: 'high' | 'medium' | 'low';
  message: string;
  originalText?: string;
  suggestedText?: string;
  explanation: string;
}

export interface BiasDetection {
  phrase: string;
  startIndex: number;
  endIndex: number;
  biasType: 'promotional' | 'political' | 'cultural' | 'gender' | 'weasel';
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface TextImprovement {
  originalPhrase: string;
  improvedPhrase: string;
  reason: string;
  category: 'clarity' | 'conciseness' | 'neutrality' | 'formality';
}

export class AIService {
  static async analyzeText(text: string, language: string = 'en'): Promise<AIAnalysisResult> {
    try {
      // For demo purposes, we'll use a mock implementation
      // In production, this would call OpenAI/Claude API
      return this.mockAIAnalysis(text, language);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      return this.fallbackAnalysis(text);
    }
  }

  private static mockAIAnalysis(text: string, language: string): AIAnalysisResult {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    
    // Calculate basic scores
    const qualityScore = Math.min(100, Math.max(0, 
      80 - (text.includes('clearly') ? 10 : 0) - 
      (text.includes('obviously') ? 10 : 0) -
      (text.includes('best') ? 15 : 0) -
      (text.includes('legendary') ? 15 : 0)
    ));

    const biasScore = this.calculateBiasScore(text);
    const readabilityScore = this.calculateReadabilityScore(words, sentences, text);

    return {
      qualityScore,
      biasScore,
      readabilityScore,
      suggestions: this.generateSuggestions(text),
      biasedPhrases: this.detectBiasedPhrases(text),
      improvements: this.generateImprovements(text)
    };
  }

  private static calculateBiasScore(text: string): number {
    const biasWords = ['clearly', 'obviously', 'best', 'worst', 'amazing', 'terrible', 'legendary'];
    const biasCount = biasWords.reduce((count, word) => 
      count + (text.toLowerCase().includes(word) ? 1 : 0), 0
    );
    return Math.max(0, 100 - (biasCount * 20));
  }

  private static calculateReadabilityScore(words: number, sentences: number, text: string): number {
    if (sentences === 0) return 0;
    
    const avgWordsPerSentence = words / sentences;
    const complexWords = text.split(/\s+/).filter(word => word.length > 6).length;
    const complexWordRatio = complexWords / words;
    
    // Simple readability calculation
    let score = 100;
    if (avgWordsPerSentence > 20) score -= 20;
    if (complexWordRatio > 0.3) score -= 20;
    
    return Math.max(0, score);
  }

  private static generateSuggestions(text: string): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    // Check for missing citations
    if (text.includes('studies show') || text.includes('research indicates')) {
      suggestions.push({
        type: 'citation',
        priority: 'high',
        message: 'Claims about studies or research need citations',
        explanation: 'Add specific citations to support factual claims'
      });
    }

    // Check for bias words
    if (text.includes('clearly') || text.includes('obviously')) {
      suggestions.push({
        type: 'neutrality',
        priority: 'high',
        message: 'Remove biased language',
        originalText: 'clearly/obviously',
        suggestedText: '[remove or provide evidence]',
        explanation: 'These words show bias and should be avoided in neutral writing'
      });
    }

    // Check for promotional language
    if (text.includes('best') || text.includes('amazing') || text.includes('legendary')) {
      suggestions.push({
        type: 'style',
        priority: 'medium',
        message: 'Use neutral, factual language',
        explanation: 'Avoid promotional or subjective adjectives'
      });
    }

    return suggestions;
  }

  private static detectBiasedPhrases(text: string): BiasDetection[] {
    const biasedPhrases: BiasDetection[] = [];
    
    const promotionalWords = [
      { word: 'legendary', suggestion: 'Use factual description with citation' },
      { word: 'amazing', suggestion: 'Use neutral adjectives' },
      { word: 'best', suggestion: 'Use comparative data with sources' },
      { word: 'worst', suggestion: 'Use factual criticism with sources' }
    ];

    const biasWords = [
      { word: 'clearly', suggestion: 'Remove or provide evidence' },
      { word: 'obviously', suggestion: 'Remove or provide evidence' },
      { word: 'of course', suggestion: 'Remove unnecessary emphasis' }
    ];

    [...promotionalWords, ...biasWords].forEach(({ word, suggestion }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        biasedPhrases.push({
          phrase: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          biasType: promotionalWords.some(p => p.word === word.toLowerCase()) ? 'promotional' : 'weasel',
          severity: 'medium',
          suggestion
        });
      }
    });

    return biasedPhrases;
  }

  private static generateImprovements(text: string): TextImprovement[] {
    const improvements: TextImprovement[] = [];

    // Simple improvement suggestions
    const replacements = [
      {
        originalPhrase: 'a lot of',
        improvedPhrase: 'many',
        reason: 'More formal and concise',
        category: 'formality' as const
      },
      {
        originalPhrase: 'very important',
        improvedPhrase: 'significant',
        reason: 'More precise and professional',
        category: 'clarity' as const
      },
      {
        originalPhrase: 'in order to',
        improvedPhrase: 'to',
        reason: 'More concise',
        category: 'conciseness' as const
      }
    ];

    replacements.forEach(replacement => {
      if (text.toLowerCase().includes(replacement.originalPhrase.toLowerCase())) {
        improvements.push(replacement);
      }
    });

    return improvements;
  }

  private static fallbackAnalysis(text: string): AIAnalysisResult {
    return {
      qualityScore: 70,
      biasScore: 80,
      readabilityScore: 75,
      suggestions: [],
      biasedPhrases: [],
      improvements: []
    };
  }
}