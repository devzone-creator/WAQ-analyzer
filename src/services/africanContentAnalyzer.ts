// WikiIndaba Hackathon 2025 - African Content Analysis Service

import { 
  AfricanContentMetrics, 
  AFRICAN_DOMAINS, 
  AFRICAN_INSTITUTIONS,
  AFRICAN_TOPICS_KEYWORDS 
} from '../types/wikiindaba';
import { WikipediaArticle } from '../types';

export class AfricanContentAnalyzer {
  
  static analyzeAfricanContent(article: WikipediaArticle): AfricanContentMetrics {
    const africanSourcesCount = this.countAfricanSources(article);
    const totalSources = article.externalLinks.length + article.references.length;
    const africanSourcesPercentage = totalSources > 0 
      ? Math.round((africanSourcesCount / totalSources) * 100) 
      : 0;
    
    const africanTopicRelevance = this.calculateTopicRelevance(article);
    const localLanguageReferences = this.countLocalLanguageReferences(article);
    const culturalContextScore = this.assessCulturalContext(article);

    return {
      africanSourcesCount,
      africanSourcesPercentage,
      africanTopicRelevance,
      localLanguageReferences,
      culturalContextScore
    };
  }

  private static countAfricanSources(article: WikipediaArticle): number {
    const allContent = [
      article.content,
      ...article.externalLinks,
      ...article.references
    ].join(' ').toLowerCase();

    let count = 0;

    // Check for African domain names
    AFRICAN_DOMAINS.forEach(domain => {
      const regex = new RegExp(`\\${domain}\\b`, 'gi');
      const matches = allContent.match(regex);
      if (matches) count += matches.length;
    });

    // Check for African institutions
    AFRICAN_INSTITUTIONS.forEach(institution => {
      const regex = new RegExp(institution, 'gi');
      const matches = allContent.match(regex);
      if (matches) count += matches.length;
    });

    return count;
  }

  private static calculateTopicRelevance(article: WikipediaArticle): number {
    const text = (article.title + ' ' + article.extract + ' ' + article.content).toLowerCase();
    
    let relevanceScore = 0;
    let matchCount = 0;

    AFRICAN_TOPICS_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matchCount += matches.length;
      }
    });

    // Score based on frequency and prominence
    if (matchCount > 50) relevanceScore = 100;
    else if (matchCount > 30) relevanceScore = 90;
    else if (matchCount > 20) relevanceScore = 80;
    else if (matchCount > 10) relevanceScore = 60;
    else if (matchCount > 5) relevanceScore = 40;
    else if (matchCount > 0) relevanceScore = 20;

    // Bonus if African keywords appear in title
    const titleLower = article.title.toLowerCase();
    const titleHasAfrican = AFRICAN_TOPICS_KEYWORDS.some(keyword => 
      titleLower.includes(keyword)
    );
    if (titleHasAfrican) relevanceScore = Math.min(100, relevanceScore + 20);

    return relevanceScore;
  }

  private static countLocalLanguageReferences(article: WikipediaArticle): number {
    const content = article.content;
    
    // Patterns for non-English/French/Arabic references
    const localLanguagePatterns = [
      /\{\{cite.*?\|language\s*=\s*(swahili|hausa|yoruba|amharic|zulu|xhosa|afrikaans|somali)/gi,
      /\[\[sw:|ha:|yo:|am:|zu:|xh:|af:|so:/gi,
      /kiswahili|hausa|yorùbá|አማርኛ|isizulu/gi
    ];

    let count = 0;
    localLanguagePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });

    return count;
  }

  private static assessCulturalContext(article: WikipediaArticle): number {
    let score = 0;
    const content = article.content.toLowerCase();
    const extract = article.extract.toLowerCase();

    // Check for cultural sensitivity indicators
    const culturalIndicators = [
      'indigenous', 'traditional', 'cultural', 'heritage',
      'ethnic', 'tribal', 'community', 'local perspective',
      'african perspective', 'decolonial', 'postcolonial'
    ];

    culturalIndicators.forEach(indicator => {
      if (content.includes(indicator) || extract.includes(indicator)) {
        score += 10;
      }
    });

    // Check for diverse perspectives
    if (content.includes('according to') || content.includes('perspective')) {
      score += 15;
    }

    // Check for local language terms preserved
    const hasLocalTerms = /\b[a-z]+\s*\([^)]*local|indigenous|traditional[^)]*\)/i.test(content);
    if (hasLocalTerms) score += 20;

    return Math.min(100, score);
  }

  static generateAfricanContentSuggestions(metrics: AfricanContentMetrics): string[] {
    const suggestions: string[] = [];

    if (metrics.africanSourcesPercentage < 30) {
      suggestions.push(
        '🌍 Include more African sources - aim for at least 30% of references from African institutions, researchers, or publications'
      );
    }

    if (metrics.africanTopicRelevance < 50) {
      suggestions.push(
        '📚 Enhance African context - add more information about African perspectives, impacts, or connections to the topic'
      );
    }

    if (metrics.localLanguageReferences === 0) {
      suggestions.push(
        '🗣️ Consider adding references in local African languages to improve linguistic diversity'
      );
    }

    if (metrics.culturalContextScore < 50) {
      suggestions.push(
        '🎭 Improve cultural context - include indigenous knowledge, traditional perspectives, and local terminology'
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        '✨ Excellent African content representation! This article demonstrates strong cultural awareness and diverse sourcing.'
      );
    }

    return suggestions;
  }
}
