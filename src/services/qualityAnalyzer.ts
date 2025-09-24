import { QualityScore, WikipediaArticle, ReadabilityScore, CitationScore, ReferenceScore, StructureScore } from '../types';

export class QualityAnalyzer {
  static analyzeArticle(article: WikipediaArticle): QualityScore {
    const readability = this.analyzeReadability(article);
    const citations = this.analyzeCitations(article);
    const references = this.analyzeReferences(article);
    const structure = this.analyzeStructure(article);

    const overall = Math.round(
      (readability.score * 0.25 + 
       citations.score * 0.25 + 
       references.score * 0.25 + 
       structure.score * 0.25)
    );

    return {
      overall,
      readability,
      citations,
      references,
      structure
    };
  }

  private static analyzeReadability(article: WikipediaArticle): ReadabilityScore {
    const text = article.extract;
    if (!text) {
      return {
        score: 0,
        averageSentenceLength: 0,
        averageWordLength: 0,
        complexWords: 0,
        fleschScore: 0
      };
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    const averageSentenceLength = words.length / sentences.length;
    const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const complexWords = words.filter(word => word.length > 6).length;
    
    // Simplified Flesch Reading Ease Score
    const fleschScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * averageSentenceLength) - (84.6 * (averageWordLength / 4.7))
    ));

    let score = 50; // Base score
    
    // Adjust based on readability metrics
    if (fleschScore >= 70) score += 30;
    else if (fleschScore >= 50) score += 20;
    else if (fleschScore >= 30) score += 10;
    
    if (averageSentenceLength <= 20) score += 10;
    if (complexWords / words.length < 0.15) score += 10;

    return {
      score: Math.min(100, Math.max(0, Math.round(score))),
      averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
      averageWordLength: Math.round(averageWordLength * 10) / 10,
      complexWords,
      fleschScore: Math.round(fleschScore)
    };
  }

  private static analyzeCitations(article: WikipediaArticle): CitationScore {
    const content = article.content;
    
    // Count various citation patterns
    const refTags = (content.match(/<ref[^>]*>/g) || []).length;
    const citationTemplates = (content.match(/\{\{cite[^}]*\}\}/gi) || []).length;
    const footnotes = (content.match(/\[\d+\]/g) || []).length;
    
    const totalCitations = refTags + citationTemplates + footnotes;
    const inlineCitations = refTags + footnotes;
    
    const wordCount = article.extract.split(/\s+/).length;
    const citationDensity = wordCount > 0 ? (totalCitations / wordCount) * 1000 : 0;

    let score = 0;
    
    // Score based on citation count and density
    if (totalCitations >= 50) score += 40;
    else if (totalCitations >= 25) score += 30;
    else if (totalCitations >= 10) score += 20;
    else if (totalCitations >= 5) score += 10;
    
    if (citationDensity >= 5) score += 30;
    else if (citationDensity >= 3) score += 20;
    else if (citationDensity >= 1) score += 10;
    
    if (inlineCitations > 0) score += 30;

    return {
      score: Math.min(100, Math.max(0, score)),
      totalCitations,
      inlineCitations,
      citationDensity: Math.round(citationDensity * 10) / 10
    };
  }

  private static analyzeReferences(article: WikipediaArticle): ReferenceScore {
    const content = article.content;
    const externalLinks = article.externalLinks || [];
    
    // Count references section
    const hasReferencesSection = /==\s*References\s*==/i.test(content);
    const bibliographySection = /==\s*(Bibliography|Sources|Further reading)\s*==/i.test(content);
    
    // Analyze source quality (simplified)
    const reliableSourcePatterns = [
      /doi\.org/i,
      /jstor\.org/i,
      /pubmed/i,
      /scholar\.google/i,
      /academia\.edu/i,
      /researchgate/i,
      /\.edu/i,
      /\.gov/i,
      /bbc\.com/i,
      /reuters\.com/i,
      /nytimes\.com/i
    ];
    
    const reliableSources = reliableSourcePatterns.reduce((count, pattern) => {
      return count + (content.match(pattern) || []).length;
    }, 0);

    let score = 0;
    
    if (hasReferencesSection) score += 30;
    if (bibliographySection) score += 10;
    if (externalLinks.length >= 10) score += 20;
    else if (externalLinks.length >= 5) score += 15;
    else if (externalLinks.length >= 2) score += 10;
    
    if (reliableSources >= 10) score += 40;
    else if (reliableSources >= 5) score += 25;
    else if (reliableSources >= 2) score += 15;

    return {
      score: Math.min(100, Math.max(0, score)),
      totalReferences: externalLinks.length,
      reliableSources,
      externalLinks: externalLinks.length,
      sourceQuality: reliableSources > 0 ? Math.min(100, (reliableSources / externalLinks.length) * 100) : 0
    };
  }

  private static analyzeStructure(article: WikipediaArticle): StructureScore {
    const content = article.content;
    const sections = article.sections || [];
    
    // Check for essential sections
    const hasIntroduction = article.extract.length > 100;
    const hasSections = sections.length > 2;
    const hasReferences = /==\s*References\s*==/i.test(content);
    
    // Analyze section balance
    const sectionLengths = sections.map(section => section.content?.length || 0);
    const avgSectionLength = sectionLengths.reduce((sum, len) => sum + len, 0) / sectionLengths.length;
    const sectionVariance = sectionLengths.reduce((sum, len) => sum + Math.pow(len - avgSectionLength, 2), 0) / sectionLengths.length;
    const sectionBalance = sectionVariance > 0 ? Math.max(0, 100 - Math.sqrt(sectionVariance) / 10) : 100;
    
    // Check header hierarchy
    const headers = (content.match(/^=+\s*.+\s*=+$/gm) || []);
    const headerLevels = headers.map(h => (h.match(/=/g) || []).length / 2);
    const properHierarchy = headerLevels.every((level, i) => 
      i === 0 || level <= headerLevels[i - 1] + 1
    );

    let score = 0;
    
    if (hasIntroduction) score += 20;
    if (hasSections) score += 20;
    if (hasReferences) score += 20;
    if (sections.length >= 5) score += 15;
    if (sectionBalance >= 70) score += 15;
    if (properHierarchy) score += 10;

    return {
      score: Math.min(100, Math.max(0, score)),
      hasIntroduction,
      hasSections,
      hasReferences,
      sectionBalance: Math.round(sectionBalance),
      headerHierarchy: properHierarchy ? 100 : 0
    };
  }

  static generateSuggestions(scores: QualityScore): string[] {
    const suggestions: string[] = [];

    if (scores.readability.score < 70) {
      suggestions.push("Improve readability by shortening sentences and using simpler vocabulary");
      if (scores.readability.averageSentenceLength > 25) {
        suggestions.push("Break down long sentences for better clarity");
      }
    }

    if (scores.citations.score < 60) {
      suggestions.push("Add more inline citations to support claims");
      if (scores.citations.citationDensity < 2) {
        suggestions.push("Increase citation density - aim for at least 2-3 citations per 1000 words");
      }
    }

    if (scores.references.score < 70) {
      suggestions.push("Add more reliable sources and external references");
      if (scores.references.reliableSources < 5) {
        suggestions.push("Include more academic or authoritative sources");
      }
    }

    if (scores.structure.score < 60) {
      if (!scores.structure.hasIntroduction) {
        suggestions.push("Add a comprehensive introduction section");
      }
      if (!scores.structure.hasSections) {
        suggestions.push("Organize content into clear sections with headers");
      }
      if (!scores.structure.hasReferences) {
        suggestions.push("Add a dedicated References section");
      }
    }

    if (suggestions.length === 0) {
      suggestions.push("Great work! This article meets high quality standards.");
    }

    return suggestions;
  }
}