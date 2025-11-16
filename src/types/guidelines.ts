// Wikipedia Guidelines Type Definitions

export interface WikipediaGuideline {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'important' | 'recommended';
  category: 'policy' | 'style' | 'content';
  link: string;
}

export interface GuidelineViolation {
  guideline: WikipediaGuideline;
  location: {
    line: number;
    text: string;
  };
  message: string;
  suggestion: string;
}

export const WIKIPEDIA_GUIDELINES: WikipediaGuideline[] = [
  {
    id: 'npov',
    name: 'Neutral Point of View',
    description: 'Articles must be written from a neutral point of view',
    severity: 'critical',
    category: 'policy',
    link: 'https://en.wikipedia.org/wiki/Wikipedia:Neutral_point_of_view'
  },
  {
    id: 'verifiability',
    name: 'Verifiability',
    description: 'Content must be verifiable in reliable sources',
    severity: 'critical',
    category: 'policy',
    link: 'https://en.wikipedia.org/wiki/Wikipedia:Verifiability'
  },
  {
    id: 'no-original-research',
    name: 'No Original Research',
    description: 'Wikipedia does not publish original thought',
    severity: 'critical',
    category: 'policy',
    link: 'https://en.wikipedia.org/wiki/Wikipedia:No_original_research'
  },
  {
    id: 'citing-sources',
    name: 'Citing Sources',
    description: 'Add citations to verify your content',
    severity: 'important',
    category: 'content',
    link: 'https://en.wikipedia.org/wiki/Wikipedia:Citing_sources'
  },
  {
    id: 'weasel-words',
    name: 'Avoid Weasel Words',
    description: 'Avoid vague attributions like "some people say"',
    severity: 'important',
    category: 'style',
    link: 'https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Words_to_watch#Unsupported_attributions'
  },
  {
    id: 'peacock-terms',
    name: 'Avoid Peacock Terms',
    description: 'Avoid promotional or subjective language',
    severity: 'important',
    category: 'style',
    link: 'https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Words_to_watch#Peacock_terms'
  }
];
