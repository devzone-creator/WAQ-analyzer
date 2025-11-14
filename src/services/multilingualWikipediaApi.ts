// WikiIndaba Hackathon 2025 - Multilingual Wikipedia API Service

import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types/wikiindaba';
import { CacheService } from './cacheService';

export class MultilingualWikipediaService {
  private static cache = CacheService.getInstance();

  static getLanguageConfig(langCode: SupportedLanguage) {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
  }

  static async searchArticles(query: string, language: SupportedLanguage = 'en'): Promise<string[]> {
    const langConfig = this.getLanguageConfig(language);
    if (!langConfig) throw new Error(`Unsupported language: ${language}`);

    const apiUrl = `${langConfig.wikipediaUrl}/w/api.php`;
    const cacheKey = `search:${language}:${query}`;
    
    return this.cache.getOrFetch(cacheKey, async () => {
      const response = await fetch(
        `${apiUrl}?action=opensearch&search=${encodeURIComponent(query)}&limit=8&format=json&origin=*`
      );
      const data = await response.json();
      return data[1] || [];
    }, 2 * 60 * 1000);
  }

  static async getArticleContent(title: string, language: SupportedLanguage = 'en'): Promise<any> {
    const langConfig = this.getLanguageConfig(language);
    if (!langConfig) throw new Error(`Unsupported language: ${language}`);

    const apiUrl = `${langConfig.wikipediaUrl}/w/api.php`;
    const cacheKey = `article:${language}:${title}`;
    
    return this.cache.getOrFetch(cacheKey, async () => {
      const [contentResponse, wikitextResponse] = await Promise.all([
        fetch(
          `${apiUrl}?action=query&format=json&titles=${encodeURIComponent(title)}&prop=extracts|sections|extlinks|categories&exintro=&explaintext=&origin=*`
        ),
        fetch(
          `${apiUrl}?action=query&format=json&titles=${encodeURIComponent(title)}&prop=revisions&rvprop=content&origin=*`
        )
      ]);

      const [contentData, wikitextData] = await Promise.all([
        contentResponse.json(),
        wikitextResponse.json()
      ]);

      const pageId = Object.keys(contentData.query.pages)[0];
      const page = contentData.query.pages[pageId];
      const wikitext = wikitextData.query.pages[pageId]?.revisions?.[0]?.['*'] || '';

      if (pageId === '-1') {
        throw new Error(`Article not found in ${langConfig.name} Wikipedia`);
      }

      return {
        title: page.title,
        extract: page.extract || '',
        content: wikitext,
        sections: page.sections || [],
        extlinks: page.extlinks || [],
        categories: page.categories || [],
        language: language
      };
    }, 10 * 60 * 1000);
  }

  static async getLanguageLinks(title: string, fromLanguage: SupportedLanguage = 'en'): Promise<{
    language: SupportedLanguage;
    title: string;
  }[]> {
    const langConfig = this.getLanguageConfig(fromLanguage);
    if (!langConfig) throw new Error(`Unsupported language: ${fromLanguage}`);

    const apiUrl = `${langConfig.wikipediaUrl}/w/api.php`;
    
    try {
      const response = await fetch(
        `${apiUrl}?action=query&format=json&titles=${encodeURIComponent(title)}&prop=langlinks&lllimit=500&origin=*`
      );
      const data = await response.json();
      
      const pageId = Object.keys(data.query.pages)[0];
      const langlinks = data.query.pages[pageId]?.langlinks || [];
      
      return langlinks
        .filter((link: any) => 
          SUPPORTED_LANGUAGES.some(lang => lang.code === link.lang)
        )
        .map((link: any) => ({
          language: link.lang as SupportedLanguage,
          title: link['*']
        }));
    } catch (error) {
      console.error('Error fetching language links:', error);
      return [];
    }
  }

  static extractUrlTitle(url: string): { title: string; language: SupportedLanguage } | null {
    for (const lang of SUPPORTED_LANGUAGES) {
      const pattern = new RegExp(`${lang.code}\\.wikipedia\\.org/wiki/([^#?]+)`);
      const match = url.match(pattern);
      if (match) {
        return {
          title: decodeURIComponent(match[1].replace(/_/g, ' ')),
          language: lang.code
        };
      }
    }
    return null;
  }

  static async compareAcrossLanguages(
    title: string, 
    languages: SupportedLanguage[]
  ): Promise<Map<SupportedLanguage, any>> {
    const results = new Map();
    
    const promises = languages.map(async (lang) => {
      try {
        const content = await this.getArticleContent(title, lang);
        results.set(lang, content);
      } catch (error) {
        console.error(`Failed to fetch ${title} in ${lang}:`, error);
        results.set(lang, null);
      }
    });

    await Promise.all(promises);
    return results;
  }
}
