// WikiIndaba Hackathon 2025 - Enhanced Types for African Wikimedia Support

export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'sw' | 'ha' | 'yo' | 'am' | 'zu';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  wikipediaUrl: string;
  direction: 'ltr' | 'rtl';
}

export interface AfricanContentMetrics {
  africanSourcesCount: number;
  africanSourcesPercentage: number;
  africanTopicRelevance: number;
  localLanguageReferences: number;
  culturalContextScore: number;
}

export interface MultilingualAnalysis {
  language: SupportedLanguage;
  analysis: any;
  africanMetrics: AfricanContentMetrics;
}

export interface CrossLanguageComparison {
  topic: string;
  analyses: MultilingualAnalysis[];
  recommendations: string[];
  gapAnalysis: {
    language: SupportedLanguage;
    missingContent: string[];
    qualityDifference: number;
  }[];
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    wikipediaUrl: 'https://en.wikipedia.org',
    direction: 'ltr'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    wikipediaUrl: 'https://fr.wikipedia.org',
    direction: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    wikipediaUrl: 'https://ar.wikipedia.org',
    direction: 'rtl'
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    wikipediaUrl: 'https://sw.wikipedia.org',
    direction: 'ltr'
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    wikipediaUrl: 'https://ha.wikipedia.org',
    direction: 'ltr'
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    wikipediaUrl: 'https://yo.wikipedia.org',
    direction: 'ltr'
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    wikipediaUrl: 'https://am.wikipedia.org',
    direction: 'ltr'
  },
  {
    code: 'zu',
    name: 'Zulu',
    nativeName: 'isiZulu',
    wikipediaUrl: 'https://zu.wikipedia.org',
    direction: 'ltr'
  }
];

export const AFRICAN_DOMAINS = [
  '.za', '.ng', '.ke', '.tz', '.ug', '.gh', '.et', '.eg', '.ma', '.dz',
  '.sn', '.ci', '.cm', '.ao', '.mz', '.zw', '.bw', '.na', '.mw', '.zm',
  '.rw', '.bi', '.so', '.sd', '.ss', '.er', '.dj', '.gm', '.sl', '.lr',
  '.gn', '.gw', '.cv', '.st', '.gq', '.ga', '.cg', '.cd', '.cf', '.td',
  '.ne', '.bf', '.ml', '.mr', '.ly', '.tn', '.mg', '.mu', '.sc', '.km'
];

export const AFRICAN_INSTITUTIONS = [
  'african union', 'au.int', 'uneca.org', 'afdb.org',
  'university of', 'université de', 'جامعة',
  'african development bank', 'african union commission',
  'ecowas', 'sadc', 'eac', 'comesa', 'igad'
];

export const AFRICAN_TOPICS_KEYWORDS = [
  'africa', 'african', 'afrique', 'أفريقيا',
  'sahara', 'sahel', 'maghreb', 'east africa', 'west africa',
  'southern africa', 'central africa', 'north africa',
  'swahili', 'bantu', 'berber', 'tuareg', 'maasai',
  'apartheid', 'colonialism', 'independence', 'decolonization'
];
