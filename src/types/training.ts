// AtiQr - Wikipedia Training Tool Types

export interface TrainingSession {
  id: string;
  originalText: string;
  correctedText: string;
  language: string;
  violations: CorrectionItem[];
  timestamp: Date;
  learningPoints: string[];
}

export interface CorrectionItem {
  type: 'error' | 'warning' | 'suggestion';
  category: 'citation' | 'npov' | 'structure' | 'grammar' | 'style' | 'weasel' | 'peacock';
  line: number;
  originalText: string;
  correctedText: string;
  explanation: string;
  guidelineLink: string;
  severity: 'critical' | 'important' | 'recommended';
}

export interface AnalysisMode {
  type: 'paste-analyze' | 'article-study';
  showCorrections: boolean;
  showExplanations: boolean;
  highlightIssues: boolean;
}

export interface LearningStats {
  totalSessions: number;
  commonMistakes: {
    category: string;
    count: number;
    examples: string[];
  }[];
  improvementScore: number;
  masteredGuidelines: string[];
  needsPractice: string[];
}
