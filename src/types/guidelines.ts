// Wikipedia Guidelines and Policies

export interface WikipediaGuideline {
  id: string;
  name: string;
  shortCode: string;
  description: string;
  category: 'content' | 'behavior' | 'style' | 'citation';
  severity: 'critical' | 'important' | 'recommended';
  url: string;
}

export const WIKIPEDIA_GUIDELINES: WikipediaGuideline[] = [
  // Core Content Policies
  {
    id: 'npov',
    name: 'Neutral Point of View',
    shortCode: 'WP:NPOV',
    description: 'All Wikipedia articles must be written from a neutral point of view, representing fairly all significant viewpoints.',
    category: 'content',
    severity: 'critical',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Neutral_point_of_view'
  },
  {
    id: 'verifiability',
    name: 'Verifiability',
    shortCode: 'WP:V',
    description: 'Material challenged or likely to be challenged must be supported by a reliable source.',
    category: 'content',
    severity: 'critical',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Verifiability'
  },
  {
    id: 'no-original-research',
    name: 'No Original Research',
    shortCode: 'WP:NOR',
    description: 'Wikipedia does not publish original thought. All material must be attributable to reliable sources.',
    category: 'content',
    severity: 'critical',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:No_original_research'
  },
  
  // Citation Guidelines
  {
    id: 'citing-sources',
    name: 'Citing Sources',
    shortCode: 'WP:CITE',
    description: 'Add citations to verify the information in your article.',
    category: 'citation',
    severity: 'critical',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Citing_sources'
  },
  {
    id: 'reliable-sources',
    name: 'Reliable Sources',
    shortCode: 'WP:RS',
    description: 'Articles should be based on reliable, published sources.',
    category: 'citation',
    severity: 'critical',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources'
  },
  
  // Style Guidelines
  {
    id: 'manual-of-style',
    name: 'Manual of Style',
    shortCode: 'WP:MOS',
    description: 'Follow Wikipedia\'s style guidelines for consistency.',
    category: 'style',
    severity: 'important',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style'
  },
  {
    id: 'weasel-words',
    name: 'Avoid Weasel Words',
    shortCode: 'WP:WEASEL',
    description: 'Avoid vague phrasing like "some people say" or "it is believed".',
    category: 'style',
    severity: 'important',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Words_to_watch#Unsupported_attributions'
  },
  {
    id: 'peacock-terms',
    name: 'Avoid Peacock Terms',
    shortCode: 'WP:PEACOCK',
    description: 'Avoid promotional language like "legendary", "world-famous", or "best".',
    category: 'style',
    severity: 'important',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Words_to_watch#Peacock_terms'
  },
  
  // Behavior Policies
  {
    id: 'civility',
    name: 'Civility',
    shortCode: 'WP:CIVIL',
    description: 'Treat other editors with respect and courtesy.',
    category: 'behavior',
    severity: 'critical',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Civility'
  },
  {
    id: 'assume-good-faith',
    name: 'Assume Good Faith',
    shortCode: 'WP:AGF',
    description: 'Assume that other editors are trying to help, not harm.',
    category: 'behavior',
    severity: 'important',
    url: 'https://en.wikipedia.org/wiki/Wikipedia:Assume_good_faith'
  }
];

export interface GuidelineViolation {
  guideline: WikipediaGuideline;
  location: {
    line: number;
    column?: number;
    text: string;
  };
  message: string;
  suggestion: string;
}
