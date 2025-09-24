import { QualityScore, WikipediaArticle, ReadabilityScore, CitationScore, ReferenceScore, StructureScore } from '../types';

export class EnhancedQualityAnalyzer {
  static analyzeArticle(article: WikipediaArticle): QualityScore {
    const readability = this.analyzeReadability(article);
    const citations = this.analyzeCitations(article);
    const references = this.analyzeReferences(article);
    const structure = this.analyzeStructure(article);

    // Enhanced weighted scoring with dynamic weights based on article type
    const weights = this.calculateDynamicWeights(article);
    
    const overall = Math.round(
      (readability.score * weights.readability + 
       citations.score * weights.citations + 
       references.score * weights.references + 
       structure.score * weights.structure)
    );

    return {
      overall,
      readability,
      citations,
      references,
      structure
    };
  }

  private static calculateDynamicWeights(article: WikipediaArticle) {
    // Adjust weights based on article characteristics
    const isScientific = /\b(research|study|analysis|scientific|academic)\b/i.test(article.extract);
    const isBiographical = /\b(born|died|biography|life|career)\b/i.test(article.extract);
    const isHistorical = /\b(history|historical|century|ancient|medieval)\b/i.test(article.extract);

    if (isScientific) {
      return { readability: 0.2, citations: 0.4, references: 0.3, structure: 0.1 };
    } else if (isBiographical) {
      return { readability: 0.3, citations: 0.25, references: 0.25, structure: 0.2 };
    } else if (isHistorical) {
      return { readability: 0.25, citations: 0.3, references: 0.3, structure: 0.15 };
    }
    
    // Default weights
    return { readability: 0.25, citations: 0.25, references: 0.25, structure: 0.25 };
  }

  private static analyzeReadability(article: WikipediaArticle): ReadabilityScore {
    const text = article.extract;
    if (!text) {
      return {
        score: 0,
        averageSentenceLength: 0,
        averageWordLength: 0,
        complexWords: 0,
        fleschScore: 0,
        gunningFogIndex: 0,
        smogIndex: 0,
        colemanLiauIndex: 0
      };
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = this.countSyllables(text);
    
    const averageSentenceLength = words.length / sentences.length;
    const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const complexWords = words.filter(word => this.countWordSyllables(word) >= 3).length;
    const complexWordPercentage = (complexWords / words.length) * 100;
    
    // Multiple readability metrics
    const fleschScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * averageSentenceLength) - (84.6 * (syllables / words.length))
    ));

    const gunningFogIndex = 0.4 * (averageSentenceLength + complexWordPercentage);
    
    const smogIndex = 1.0430 * Math.sqrt(complexWords * (30 / sentences.length)) + 3.1291;
    
    const colemanLiauIndex = (0.0588 * ((text.replace(/[^a-zA-Z]/g, '').length / words.length) * 100)) - 
                            (0.296 * (sentences.length / words.length * 100)) - 15.8;

    // Enhanced scoring based on multiple metrics
    let score = 50;
    
    if (fleschScore >= 80) score += 25;
    else if (fleschScore >= 70) score += 20;
    else if (fleschScore >= 60) score += 15;
    else if (fleschScore >= 50) score += 10;
    
    if (gunningFogIndex <= 8) score += 15;
    else if (gunningFogIndex <= 12) score += 10;
    else if (gunningFogIndex <= 16) score += 5;
    
    if (averageSentenceLength <= 15) score += 10;
    else if (averageSentenceLength <= 20) score += 5;

    return {
      score: Math.min(100, Math.max(0, Math.round(score))),
      averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
      averageWordLength: Math.round(averageWordLength * 10) / 10,
      complexWords,
      fleschScore: Math.round(fleschScore),
      gunningFogIndex: Math.round(gunningFogIndex * 10) / 10,
      smogIndex: Math.round(smogIndex * 10) / 10,
      colemanLiauIndex: Math.round(colemanLiauIndex * 10) / 10
    };
  }

  private static countSyllables(text: string): number {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiouy]+/g, 'a')
      .replace(/a$/, '')
      .length || 1;
  }

  private static countWordSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = word.match(/[aeiouy]+/g);
    let syllableCount = vowels ? vowels.length : 1;
    
    if (word.endsWith('e')) syllableCount--;
    if (word.endsWith('le') && word.length > 2) syllableCount++;
    
    return Math.max(1, syllableCount);
  }

  private static analyzeCitations(article: WikipediaArticle): CitationScore {
    const content = article.content;
    
    // Enhanced citation pattern recognition
    const refTags = (content.match(/<ref[^>]*>.*?<\/ref>/g) || []).length;
    const selfClosingRefs = (content.match(/<ref[^>]*\/>/g) || []).length;
    const citationTemplates = (content.match(/\{\{cite[^}]*\}\}/gi) || []).length;
    const footnotes = (content.match(/\[\d+\]/g) || []).length;
    const namedRefs = (content.match(/<ref\s+name\s*=/gi) || []).length;
    
    const totalCitations = refTags + selfClosingRefs + citationTemplates + footnotes;
    const inlineCitations = refTags + selfClosingRefs + footnotes;
    
    const wordCount = article.extract.split(/\s+/).length;
    const citationDensity = wordCount > 0 ? (totalCitations / wordCount) * 1000 : 0;
    
    // Citation quality assessment
    const qualityCitations = this.assessCitationQuality(content);
    const citationDistribution = this.analyzeCitationDistribution(content);

    let score = 0;
    
    // Base citation count scoring
    if (totalCitations >= 100) score += 35;
    else if (totalCitations >= 50) score += 30;
    else if (totalCitations >= 25) score += 25;
    else if (totalCitations >= 10) score += 15;
    else if (totalCitations >= 5) score += 10;
    
    // Citation density scoring
    if (citationDensity >= 8) score += 25;
    else if (citationDensity >= 5) score += 20;
    else if (citationDensity >= 3) score += 15;
    else if (citationDensity >= 1) score += 10;
    
    // Quality and distribution bonuses
    if (qualityCitations > totalCitations * 0.7) score += 20;
    else if (qualityCitations > totalCitations * 0.5) score += 15;
    else if (qualityCitations > totalCitations * 0.3) score += 10;
    
    if (citationDistribution > 0.8) score += 20;
    else if (citationDistribution > 0.6) score += 15;
    else if (citationDistribution > 0.4) score += 10;

    return {
      score: Math.min(100, Math.max(0, score)),
      totalCitations,
      inlineCitations,
      citationDensity: Math.round(citationDensity * 10) / 10,
      namedReferences: namedRefs,
      citationQuality: Math.round((qualityCitations / Math.max(1, totalCitations)) * 100),
      distributionScore: Math.round(citationDistribution * 100)
    };
  }

  private static assessCitationQuality(content: string): number {
    const qualityPatterns = [
      /doi\s*=\s*10\./gi,
      /pmid\s*=\s*\d+/gi,
      /isbn\s*=\s*[\d-]+/gi,
      /journal\s*=\s*[^|}]+/gi,
      /publisher\s*=\s*[^|}]+/gi,
      /author\s*=\s*[^|}]+/gi,
      /date\s*=\s*\d{4}/gi,
      /url\s*=\s*https?:\/\/[^|}]+/gi
    ];
    
    return qualityPatterns.reduce((count, pattern) => {
      return count + (content.match(pattern) || []).length;
    }, 0);
  }

  private static analyzeCitationDistribution(content: string): number {
    const sections = content.split(/==\s*[^=]+\s*==/);
    const sectionsWithCitations = sections.filter(section => 
      /<ref|cite|footnote|\[\d+\]/.test(section)
    ).length;
    
    return sections.length > 1 ? sectionsWithCitations / sections.length : 1;
  }

  private static analyzeReferences(article: WikipediaArticle): ReferenceScore {
    const content = article.content;
    const externalLinks = article.externalLinks || [];
    
    // Enhanced source quality analysis
    const sourceAnalysis = this.analyzeSourceQuality(content, externalLinks);
    const diversityScore = this.analyzeSourceDiversity(content, externalLinks);
    const recentnessScore = this.analyzeSourceRecency(content);
    
    let score = 0;
    
    // Base reference count
    if (externalLinks.length >= 50) score += 25;
    else if (externalLinks.length >= 25) score += 20;
    else if (externalLinks.length >= 10) score += 15;
    else if (externalLinks.length >= 5) score += 10;
    
    // Source quality
    score += Math.min(35, sourceAnalysis.qualityScore);
    
    // Source diversity
    score += Math.min(25, diversityScore);
    
    // Source recency
    score += Math.min(15, recentnessScore);

    return {
      score: Math.min(100, Math.max(0, score)),
      totalReferences: externalLinks.length,
      reliableSources: sourceAnalysis.reliableCount,
      externalLinks: externalLinks.length,
      sourceQuality: sourceAnalysis.qualityScore,
      sourceDiversity: diversityScore,
      sourceRecency: recentnessScore,
      academicSources: sourceAnalysis.academicCount,
      governmentSources: sourceAnalysis.governmentCount,
      newsSources: sourceAnalysis.newsCount
    };
  }

  private static analyzeSourceQuality(content: string, externalLinks: string[]) {
    const reliablePatterns = {
      academic: [
        /\.edu\//i, /jstor\.org/i, /pubmed/i, /scholar\.google/i, 
        /academia\.edu/i, /researchgate/i, /springer/i, /wiley/i,
        /nature\.com/i, /science\.org/i, /cell\.com/i
      ],
      government: [
        /\.gov\//i, /\.gov\.uk/i, /europa\.eu/i, /un\.org/i,
        /who\.int/i, /nasa\.gov/i, /cdc\.gov/i
      ],
      news: [
        /bbc\.com/i, /reuters\.com/i, /nytimes\.com/i, /washingtonpost/i,
        /theguardian/i, /cnn\.com/i, /npr\.org/i, /apnews\.com/i
      ],
      books: [
        /books\.google/i, /archive\.org/i, /gutenberg\.org/i
      ]
    };

    let academicCount = 0;
    let governmentCount = 0;
    let newsCount = 0;
    let reliableCount = 0;

    const allSources = content + ' ' + externalLinks.join(' ');

    Object.entries(reliablePatterns).forEach(([type, patterns]) => {
      patterns.forEach(pattern => {
        const matches = (allSources.match(pattern) || []).length;
        reliableCount += matches;
        
        if (type === 'academic') academicCount += matches;
        else if (type === 'government') governmentCount += matches;
        else if (type === 'news') newsCount += matches;
      });
    });

    const qualityScore = Math.min(35, (reliableCount / Math.max(1, externalLinks.length)) * 35);

    return {
      reliableCount,
      academicCount,
      governmentCount,
      newsCount,
      qualityScore
    };
  }

  private static analyzeSourceDiversity(content: string, externalLinks: string[]): number {
    const domains = new Set();
    const urlPattern = /https?:\/\/([^\/\s]+)/gi;
    let match;
    
    while ((match = urlPattern.exec(content + ' ' + externalLinks.join(' '))) !== null) {
      const domain = match[1].toLowerCase().replace(/^www\./, '');
      domains.add(domain);
    }
    
    // Score based on domain diversity
    if (domains.size >= 20) return 25;
    if (domains.size >= 15) return 20;
    if (domains.size >= 10) return 15;
    if (domains.size >= 5) return 10;
    return Math.min(10, domains.size * 2);
  }

  private static analyzeSourceRecency(content: string): number {
    const currentYear = new Date().getFullYear();
    const yearPattern = /\b(19|20)\d{2}\b/g;
    const years = content.match(yearPattern)?.map(y => parseInt(y)) || [];
    
    if (years.length === 0) return 0;
    
    const recentYears = years.filter(year => currentYear - year <= 5).length;
    const recentPercentage = recentYears / years.length;
    
    return Math.round(recentPercentage * 15);
  }

  private static analyzeStructure(article: WikipediaArticle): StructureScore {
    const content = article.content;
    const sections = article.sections || [];
    
    // Enhanced structure analysis
    const structuralElements = this.analyzeStructuralElements(content, sections);
    const navigationElements = this.analyzeNavigationElements(content);
    const contentBalance = this.analyzeContentBalance(sections);
    
    let score = 0;
    
    // Essential elements
    if (structuralElements.hasIntroduction) score += 15;
    if (structuralElements.hasSections) score += 15;
    if (structuralElements.hasReferences) score += 15;
    if (structuralElements.hasInfobox) score += 10;
    if (structuralElements.hasCategories) score += 5;
    
    // Navigation and organization
    if (navigationElements.hasTOC) score += 10;
    if (navigationElements.hasNavbox) score += 5;
    if (navigationElements.hasSeeAlso) score += 5;
    
    // Content quality
    score += Math.min(20, contentBalance.balanceScore);

    return {
      score: Math.min(100, Math.max(0, score)),
      hasIntroduction: structuralElements.hasIntroduction,
      hasSections: structuralElements.hasSections,
      hasReferences: structuralElements.hasReferences,
      sectionBalance: contentBalance.balanceScore,
      headerHierarchy: contentBalance.hierarchyScore,
      hasInfobox: structuralElements.hasInfobox,
      hasCategories: structuralElements.hasCategories,
      navigationScore: navigationElements.score,
      sectionCount: sections.length
    };
  }

  private static analyzeStructuralElements(content: string, sections: any[]) {
    return {
      hasIntroduction: sections.length > 0 && sections[0].content?.length > 100,
      hasSections: sections.length > 3,
      hasReferences: /==\s*References\s*==/i.test(content),
      hasInfobox: /\{\{infobox/i.test(content),
      hasCategories: /\[\[category:/i.test(content)
    };
  }

  private static analyzeNavigationElements(content: string) {
    const hasTOC = /__TOC__|__FORCETOC__/i.test(content);
    const hasNavbox = /\{\{navbox/i.test(content);
    const hasSeeAlso = /==\s*See also\s*==/i.test(content);
    
    let score = 0;
    if (hasTOC) score += 5;
    if (hasNavbox) score += 3;
    if (hasSeeAlso) score += 2;
    
    return { hasTOC, hasNavbox, hasSeeAlso, score };
  }

  private static analyzeContentBalance(sections: any[]): { balanceScore: number; hierarchyScore: number } {
    if (sections.length <= 1) return { balanceScore: 0, hierarchyScore: 0 };
    
    const sectionLengths = sections.map(s => s.content?.length || 0);
    const avgLength = sectionLengths.reduce((sum, len) => sum + len, 0) / sectionLengths.length;
    
    // Calculate variance for balance
    const variance = sectionLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sectionLengths.length;
    const balanceScore = Math.max(0, 20 - Math.sqrt(variance) / 100);
    
    // Check header hierarchy
    const headerPattern = /^=+\s*.+\s*=+$/gm;
    const headers = sections.map(s => s.level || 2);
    const properHierarchy = headers.every((level, i) => 
      i === 0 || level <= headers[i - 1] + 1
    );
    
    return {
      balanceScore: Math.round(balanceScore),
      hierarchyScore: properHierarchy ? 100 : 50
    };
  }

  static generateEnhancedSuggestions(scores: QualityScore): Array<{
    category: 'critical' | 'important' | 'minor';
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
  }> {
    const suggestions: Array<{
      category: 'critical' | 'important' | 'minor';
      suggestion: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'low' | 'medium' | 'high';
    }> = [];

    // Critical issues (score < 50)
    if (scores.citations.score < 50) {
      suggestions.push({
        category: 'critical',
        suggestion: 'Add inline citations throughout the article - this is essential for Wikipedia quality standards',
        impact: 'high',
        effort: 'high'
      });
    }

    if (scores.references.score < 50) {
      suggestions.push({
        category: 'critical',
        suggestion: 'Include more reliable sources, particularly academic journals and authoritative publications',
        impact: 'high',
        effort: 'medium'
      });
    }

    // Important improvements (score < 70)
    if (scores.readability.score < 70) {
      if (scores.readability.averageSentenceLength > 25) {
        suggestions.push({
          category: 'important',
          suggestion: 'Break down long sentences to improve readability - aim for 15-20 words per sentence',
          impact: 'medium',
          effort: 'medium'
        });
      }
      
      if (scores.readability.fleschScore < 50) {
        suggestions.push({
          category: 'important',
          suggestion: 'Simplify vocabulary and sentence structure to make the article more accessible',
          impact: 'medium',
          effort: 'high'
        });
      }
    }

    if (scores.structure.score < 70) {
      if (!scores.structure.hasIntroduction) {
        suggestions.push({
          category: 'important',
          suggestion: 'Add a comprehensive introduction that summarizes the main points',
          impact: 'high',
          effort: 'medium'
        });
      }
      
      if (scores.structure.sectionCount < 4) {
        suggestions.push({
          category: 'important',
          suggestion: 'Organize content into more sections with clear headings for better structure',
          impact: 'medium',
          effort: 'medium'
        });
      }
    }

    // Minor improvements
    if (scores.citations.citationDensity < 3) {
      suggestions.push({
        category: 'minor',
        suggestion: 'Increase citation density - aim for 3-5 citations per 1000 words',
        impact: 'medium',
        effort: 'medium'
      });
    }

    if (scores.references.sourceDiversity < 15) {
      suggestions.push({
        category: 'minor',
        suggestion: 'Diversify sources by including different types of publications and perspectives',
        impact: 'low',
        effort: 'low'
      });
    }

    if (!scores.structure.hasInfobox) {
      suggestions.push({
        category: 'minor',
        suggestion: 'Consider adding an infobox to provide key facts at a glance',
        impact: 'low',
        effort: 'low'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        category: 'minor',
        suggestion: 'Excellent work! This article meets high quality standards across all metrics.',
        impact: 'low',
        effort: 'low'
      });
    }

    return suggestions;
  }
}