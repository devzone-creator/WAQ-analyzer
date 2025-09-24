export interface WikipediaArticle {
  title: string;
  extract: string;
  content: string;
  url: string;
  sections: WikipediaSection[];
  references: string[];
  externalLinks: string[];
}

export interface WikipediaSection {
  title: string;
  content: string;
  level: number;
}

export interface QualityScore {
  overall: number;
  readability: ReadabilityScore;
  citations: CitationScore;
  references: ReferenceScore;
  structure: StructureScore;
}

export interface ReadabilityScore {
  score: number;
  averageSentenceLength: number;
  averageWordLength: number;
  complexWords: number;
  fleschScore: number;
  gunningFogIndex?: number;
  smogIndex?: number;
  colemanLiauIndex?: number;
}

export interface CitationScore {
  score: number;
  totalCitations: number;
  inlineCitations: number;
  citationDensity: number;
  namedReferences?: number;
  citationQuality?: number;
  distributionScore?: number;
}

export interface ReferenceScore {
  score: number;
  totalReferences: number;
  reliableSources: number;
  externalLinks: number;
  sourceQuality: number;
  sourceDiversity?: number;
  sourceRecency?: number;
  academicSources?: number;
  governmentSources?: number;
  newsSources?: number;
}

export interface StructureScore {
  score: number;
  hasIntroduction: boolean;
  hasSections: boolean;
  hasReferences: boolean;
  sectionBalance: number;
  headerHierarchy: number;
  hasInfobox?: boolean;
  hasCategories?: boolean;
  navigationScore?: number;
  sectionCount?: number;
}

export interface AnalysisResult {
  article: WikipediaArticle;
  scores: QualityScore;
  suggestions: string[];
  timestamp: string;
}

export interface EnhancedSuggestion {
  category: 'critical' | 'important' | 'minor';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

export interface ComparisonResult {
  articles: AnalysisResult[];
  comparison: {
    metric: string;
    values: number[];
    winner: string;
  }[];
  insights: string[];
}