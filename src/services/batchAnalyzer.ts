import { WikipediaService } from './wikipediaApi';
import { EnhancedQualityAnalyzer } from './enhancedQualityAnalyzer';
import { AnalysisResult, WikipediaArticle } from '../types';

export interface BatchAnalysisProgress {
  completed: number;
  total: number;
  currentArticle: string;
  results: AnalysisResult[];
  errors: Array<{ title: string; error: string }>;
}

export class BatchAnalyzer {
  private static readonly BATCH_SIZE = 3; // Process 3 articles at a time
  private static readonly DELAY_BETWEEN_BATCHES = 1000; // 1 second delay

  static async analyzeMultiple(
    titles: string[],
    onProgress?: (progress: BatchAnalysisProgress) => void
  ): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    const errors: Array<{ title: string; error: string }> = [];
    
    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < titles.length; i += this.BATCH_SIZE) {
      const batch = titles.slice(i, i + this.BATCH_SIZE);
      
      const batchPromises = batch.map(async (title) => {
        try {
          onProgress?.({
            completed: i,
            total: titles.length,
            currentArticle: title,
            results: [...results],
            errors: [...errors]
          });

          const articleData = await WikipediaService.getArticleContent(title);
          
          const article: WikipediaArticle = {
            title: articleData.title,
            extract: articleData.extract,
            content: articleData.content,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(articleData.title)}`,
            sections: articleData.sections.map((section: any) => ({
              title: section.line || '',
              content: section.content || '',
              level: section.level || 1
            })),
            references: [],
            externalLinks: articleData.extlinks.map((link: any) => 
              link['*'] || link.url || ''
            ).filter(Boolean)
          };
          
          const scores = EnhancedQualityAnalyzer.analyzeArticle(article);
          const suggestions = EnhancedQualityAnalyzer.generateEnhancedSuggestions(scores);
          
          return {
            article,
            scores,
            suggestions: suggestions.map(s => s.suggestion),
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          errors.push({
            title,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter((result): result is AnalysisResult => result !== null));
      
      // Delay between batches to be respectful to Wikipedia's servers
      if (i + this.BATCH_SIZE < titles.length) {
        await new Promise(resolve => setTimeout(resolve, this.DELAY_BETWEEN_BATCHES));
      }
    }

    onProgress?.({
      completed: titles.length,
      total: titles.length,
      currentArticle: '',
      results,
      errors
    });

    return results;
  }

  static async analyzeCategory(
    category: string,
    limit: number = 20
  ): Promise<AnalysisResult[]> {
    try {
      // Get articles from category
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmlimit=${limit}&format=json&origin=*`
      );
      
      const data = await response.json();
      const articles = data.query?.categorymembers || [];
      const titles = articles.map((article: any) => article.title);
      
      return this.analyzeMultiple(titles);
    } catch (error) {
      console.error('Error analyzing category:', error);
      return [];
    }
  }

  static generateBatchReport(results: AnalysisResult[]): {
    summary: {
      totalArticles: number;
      averageScore: number;
      scoreDistribution: { range: string; count: number }[];
      topPerformers: AnalysisResult[];
      needsImprovement: AnalysisResult[];
    };
    metrics: {
      readability: { average: number; median: number };
      citations: { average: number; median: number };
      references: { average: number; median: number };
      structure: { average: number; median: number };
    };
  } {
    if (results.length === 0) {
      return {
        summary: {
          totalArticles: 0,
          averageScore: 0,
          scoreDistribution: [],
          topPerformers: [],
          needsImprovement: []
        },
        metrics: {
          readability: { average: 0, median: 0 },
          citations: { average: 0, median: 0 },
          references: { average: 0, median: 0 },
          structure: { average: 0, median: 0 }
        }
      };
    }

    const scores = results.map(r => r.scores.overall);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    const scoreDistribution = [
      { range: '90-100', count: scores.filter(s => s >= 90).length },
      { range: '80-89', count: scores.filter(s => s >= 80 && s < 90).length },
      { range: '70-79', count: scores.filter(s => s >= 70 && s < 80).length },
      { range: '60-69', count: scores.filter(s => s >= 60 && s < 70).length },
      { range: '50-59', count: scores.filter(s => s >= 50 && s < 60).length },
      { range: '0-49', count: scores.filter(s => s < 50).length }
    ];

    const sortedResults = [...results].sort((a, b) => b.scores.overall - a.scores.overall);
    const topPerformers = sortedResults.slice(0, 5);
    const needsImprovement = sortedResults.slice(-5).reverse();

    const getMetricStats = (metric: keyof typeof results[0]['scores']) => {
      const values = results.map(r => (r.scores[metric] as any).score || r.scores[metric]);
      const sorted = [...values].sort((a, b) => a - b);
      return {
        average: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
        median: sorted[Math.floor(sorted.length / 2)]
      };
    };

    return {
      summary: {
        totalArticles: results.length,
        averageScore: Math.round(averageScore),
        scoreDistribution,
        topPerformers,
        needsImprovement
      },
      metrics: {
        readability: getMetricStats('readability'),
        citations: getMetricStats('citations'),
        references: getMetricStats('references'),
        structure: getMetricStats('structure')
      }
    };
  }
}