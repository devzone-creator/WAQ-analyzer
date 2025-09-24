import { CacheService } from './cacheService';

const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/api/rest_v1';
const WIKIPEDIA_API_ACTION = 'https://en.wikipedia.org/w/api.php';

export class WikipediaService {
  private static cache = CacheService.getInstance();

  static async searchArticles(query: string): Promise<string[]> {
    const cacheKey = `search:${query}`;
    
    return this.cache.getOrFetch(cacheKey, async () => {
      const response = await fetch(
        `${WIKIPEDIA_API_ACTION}?action=opensearch&search=${encodeURIComponent(query)}&limit=8&format=json&origin=*`
      );
      const data = await response.json();
      return data[1] || [];
    }, 2 * 60 * 1000); // 2 minutes cache
  }

  static async getArticleContent(title: string): Promise<any> {
    const cacheKey = `article:${title}`;
    
    return this.cache.getOrFetch(cacheKey, async () => {
      // Parallel API calls for better performance
      const [contentResponse, wikitextResponse] = await Promise.all([
        fetch(
          `${WIKIPEDIA_API_ACTION}?action=query&format=json&titles=${encodeURIComponent(title)}&prop=extracts|sections|extlinks|categories&exintro=&explaintext=&origin=*`
        ),
        fetch(
          `${WIKIPEDIA_API_ACTION}?action=query&format=json&titles=${encodeURIComponent(title)}&prop=revisions&rvprop=content&origin=*`
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
        throw new Error('Article not found');
      }

      return {
        title: page.title,
        extract: page.extract || '',
        content: wikitext,
        sections: page.sections || [],
        extlinks: page.extlinks || [],
        categories: page.categories || []
      };
    }, 10 * 60 * 1000); // 10 minutes cache
  }

  static extractUrlTitle(url: string): string | null {
    const match = url.match(/wikipedia\.org\/wiki\/([^#?]+)/);
    return match ? decodeURIComponent(match[1].replace(/_/g, ' ')) : null;
  }

  static async getRandomArticles(count: number = 5): Promise<string[]> {
    try {
      const response = await fetch(
        `${WIKIPEDIA_API_ACTION}?action=query&format=json&list=random&rnnamespace=0&rnlimit=${count}&origin=*`
      );
      const data = await response.json();
      return data.query?.random?.map((page: any) => page.title) || [];
    } catch (error) {
      console.error('Error fetching random articles:', error);
      return [];
    }
  }

  static async getFeaturedArticles(limit: number = 10): Promise<string[]> {
    try {
      const response = await fetch(
        `${WIKIPEDIA_API_ACTION}?action=query&format=json&list=categorymembers&cmtitle=Category:Featured_articles&cmlimit=${limit}&origin=*`
      );
      const data = await response.json();
      return data.query?.categorymembers?.map((page: any) => page.title) || [];
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return [];
    }
  }

  // Clear cache for testing or memory management
  static clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  static getCacheStats() {
    return this.cache.getStats();
  }
}