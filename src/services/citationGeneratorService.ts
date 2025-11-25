/**
 * Citation Generator Service
 * Converts URLs and metadata to standard {{cite web}} wikitext format
 * Used in Step 3 (Citation Structure)
 */

import { Citation } from '../types/waca';

export interface CitationMetadata {
  url: string;
  title: string;
  authors?: string[];
  publicationDate?: string;
  website?: string;
  accessDate?: string;
}

export class CitationGeneratorService {
  /**
   * Generate {{cite web}} wikitext from URL and metadata
   */
  static generateCitation(metadata: CitationMetadata): Citation {
    const wikitext = this.buildCiteWeb(metadata);

    return {
      url: metadata.url,
      title: metadata.title,
      authors: metadata.authors || [],
      publicationDate: metadata.publicationDate,
      wikitext
    };
  }

  /**
   * Build {{cite web}} template wikitext
   */
  private static buildCiteWeb(metadata: CitationMetadata): string {
    const parts: string[] = ['{{cite web'];

    // Add URL (required)
    if (metadata.url) {
      parts.push(`| url = ${this.sanitizeUrl(metadata.url)}`);
    }

    // Add title (required)
    if (metadata.title) {
      parts.push(`| title = ${this.escapePipeCharacter(metadata.title)}`);
    }

    // Add authors
    if (metadata.authors && metadata.authors.length > 0) {
      if (metadata.authors.length === 1) {
        parts.push(`| author = ${metadata.authors[0]}`);
      } else {
        // Multiple authors
        metadata.authors.forEach((author, index) => {
          const authorKey = index === 0 ? 'author' : `author${index + 1}`;
          parts.push(`| ${authorKey} = ${author}`);
        });
      }
    }

    // Add publication date
    if (metadata.publicationDate) {
      parts.push(`| date = ${metadata.publicationDate}`);
    }

    // Add website name if available
    if (metadata.website) {
      parts.push(`| website = ${this.escapePipeCharacter(metadata.website)}`);
    }

    // Add access date (always include today's date for web sources)
    const accessDate = metadata.accessDate || this.getTodayFormatted();
    parts.push(`| access-date = ${accessDate}`);

    parts.push('}}');

    return parts.join('\n');
  }

  /**
   * Sanitize URL for wikitext (ensure proper encoding)
   */
  private static sanitizeUrl(url: string): string {
    try {
      // Validate URL
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.toString();
    } catch {
      // If invalid, return as-is with https prefix
      return url.startsWith('http') ? url : `https://${url}`;
    }
  }

  /**
   * Escape pipe character in wikitext strings
   */
  private static escapePipeCharacter(text: string): string {
    return text.replace(/\|/g, '&#124;');
  }

  /**
   * Get today's date in MediaWiki format (YYYY-MM-DD)
   */
  private static getTodayFormatted(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Generate standard section headings for article
   */
  static generateStandardHeadings(): string[] {
    return [
      '== Background ==',
      '== Career ==',
      '== Personal life ==',
      '== Legacy ==',
      '== References ==',
      '== External links =='
    ];
  }

  /**
   * Auto-generate reference section with citations
   */
  static generateReferencesSection(citations: Citation[]): string {
    if (citations.length === 0) {
      return '== References ==\n<references />';
    }

    const parts = ['== References =='];
    citations.forEach((citation, index) => {
      parts.push(`<ref name="ref${index + 1}">${citation.wikitext}</ref>`);
    });
    parts.push('<references />');

    return parts.join('\n\n');
  }

  /**
   * Parse URL to extract basic metadata (title, domain)
   */
  static async parseUrlMetadata(url: string): Promise<Partial<CitationMetadata>> {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);

      // Extract domain/website
      const website = urlObj.hostname
        .replace('www.', '')
        .split('.')
        .slice(0, -1)
        .join('.');

      return {
        url: url,
        website: website,
        accessDate: this.getTodayFormatted()
      };
    } catch {
      return {
        url: url
      };
    }
  }

  /**
   * Template snippets for user convenience
   */
  static getTemplateSnippets(): Record<string, string> {
    return {
      basic: '{{cite web|url=|title=|website=|access-date=YYYY-MM-DD}}',
      withAuthor:
        '{{cite web|url=|title=|author=|date=YYYY-MM-DD|website=|access-date=YYYY-MM-DD}}',
      fullNews:
        '{{cite news|url=|title=|author=|date=YYYY-MM-DD|work=|access-date=YYYY-MM-DD}}',
      book: '{{cite book|title=|author=|year=|publisher=|pages=}}',
      journal:
        '{{cite journal|title=|author=|journal=|year=|pages=|doi=}}',
      refTag: '<ref>{{cite web|url=|title=|access-date=YYYY-MM-DD}}</ref>'
    };
  }

  /**
   * Inline reference helper - wrap citation in <ref> tags
   */
  static wrapInRefTags(citation: Citation): string {
    return `<ref>${citation.wikitext}</ref>`;
  }

  /**
   * Validate citation completeness
   */
  static validateCitation(citation: Citation): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const missingFields: string[] = [];
    const warnings: string[] = [];

    if (!citation.url) missingFields.push('URL');
    if (!citation.title) missingFields.push('Title');
    if (!citation.wikitext) missingFields.push('Wikitext');

    if (citation.authors && citation.authors.length === 0) {
      warnings.push('No author specified (optional but recommended)');
    }

    if (!citation.publicationDate) {
      warnings.push(
        'No publication date (helpful for verification, but optional)'
      );
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }
}
