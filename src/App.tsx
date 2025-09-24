import React, { useState, useEffect } from 'react';
import { Search, FileText, BarChart3, AlertCircle, Layers, Zap, Menu, X } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ArticleInput } from './components/ArticleInput';
import { EnhancedAnalysisResults } from './components/EnhancedAnalysisResults';
import { RecentAnalyses } from './components/RecentAnalyses';
import { BatchAnalysisModal } from './components/BatchAnalysisModal';
import { WikipediaService } from './services/wikipediaApi';
import { EnhancedQualityAnalyzer } from './services/enhancedQualityAnalyzer';
import { CacheService } from './services/cacheService';
import { AnalysisResult } from './types';

function App() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load recent analyses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentAnalyses');
    if (saved) {
      try {
        setRecentAnalyses(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent analyses:', error);
      }
    }

    // Update cache stats
    const updateCacheStats = () => {
      setCacheStats(WikipediaService.getCacheStats());
    };
    updateCacheStats();
    const interval = setInterval(updateCacheStats, 30000); // Update every 30 seconds

    // Cleanup cache periodically
    const cacheCleanup = setInterval(() => {
      CacheService.getInstance().cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(interval);
      clearInterval(cacheCleanup);
    };
  }, []);

  // Save recent analyses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentAnalyses', JSON.stringify(recentAnalyses));
  }, [recentAnalyses]);

  // Close sidebar when analysis is selected on mobile
  useEffect(() => {
    if (currentAnalysis && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [currentAnalysis]);

  const handleAnalyze = async (input: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      let title = input;
      
      // Check if input is a Wikipedia URL
      const urlTitle = WikipediaService.extractUrlTitle(input);
      if (urlTitle) {
        title = urlTitle;
      }
      
      // Fetch article content with caching
      const articleData = await WikipediaService.getArticleContent(title);
      
      // Create article object
      const article = {
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
        externalLinks: articleData.extlinks.map((link: any) => link['*'] || link.url || '').filter(Boolean)
      };
      
      // Analyze quality with enhanced analyzer
      const scores = EnhancedQualityAnalyzer.analyzeArticle(article);
      const enhancedSuggestions = EnhancedQualityAnalyzer.generateEnhancedSuggestions(scores);
      
      const analysis: AnalysisResult = {
        article,
        scores,
        suggestions: enhancedSuggestions.map(s => s.suggestion),
        timestamp: new Date().toISOString()
      };
      
      setCurrentAnalysis(analysis);
      setRecentAnalyses(prev => {
        const filtered = prev.filter(a => a.article.title !== analysis.article.title);
        return [analysis, ...filtered.slice(0, 9)]; // Keep max 10 analyses
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze article');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBatchComplete = (results: AnalysisResult[]) => {
    setRecentAnalyses(prev => {
      const combined = [...results, ...prev];
      const unique = combined.filter((analysis, index, self) => 
        index === self.findIndex(a => a.article.title === analysis.article.title)
      );
      return unique.slice(0, 20); // Keep max 20 analyses
    });
    setShowBatchModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Mobile Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors duration-150"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>

            {/* Logo and Title */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-1.5 lg:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg lg:rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">
                  <span className="hidden sm:inline">Wikipedia Quality Analyzer</span>
                  <span className="sm:hidden">WQA</span>
                </h1>
                <p className="hidden lg:block text-sm text-slate-600 dark:text-slate-300">Enhanced analysis with advanced metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Dark Mode Toggle */}
              <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
              
              {/* Cache Stats - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <Zap className="h-3 w-3" />
                <span>{cacheStats.size} cached</span>
              </div>
              
              {/* Feature Icons - Hidden on mobile */}
              <div className="hidden xl:flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Enhanced Readability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Smart Citations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4" />
                  <span>Batch Analysis</span>
                </div>
              </div>

              {/* Batch Analysis Button */}
              <button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 text-white rounded-lg lg:rounded-xl hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-700 dark:hover:to-pink-800 transition-all duration-200 shadow-lg text-sm lg:text-base"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Batch</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Sidebar - Mobile Drawer / Desktop Column */}
            <div className={`
              lg:col-span-1 lg:relative lg:transform-none lg:transition-none
              fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="h-full bg-white/90 dark:bg-slate-900/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none border-r lg:border-r-0 border-slate-200/50 dark:border-slate-700/50 lg:space-y-6 overflow-y-auto">
                <div className="p-4 lg:p-0 space-y-4 lg:space-y-6">
                  {/* Mobile Header Spacer */}
                  <div className="lg:hidden h-4"></div>
                  
                  <ArticleInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
                  
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                        <span className="text-red-700 dark:text-red-300 font-medium">Error</span>
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                    </div>
                  )}
                  
                  {recentAnalyses.length > 0 && (
                    <RecentAnalyses 
                      analyses={recentAnalyses} 
                      onSelect={setCurrentAnalysis}
                      current={currentAnalysis}
                    />
                  )}

                  {/* Performance Stats */}
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Performance</h3>
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span>Cached Articles</span>
                        <span className="font-medium text-slate-900 dark:text-white">{cacheStats.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Analyses</span>
                        <span className="font-medium text-slate-900 dark:text-white">{recentAnalyses.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Score</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {recentAnalyses.length > 0 
                            ? Math.round(recentAnalyses.reduce((sum, a) => sum + a.scores.overall, 0) / recentAnalyses.length)
                            : 0
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 mt-4 lg:mt-0">
              {currentAnalysis ? (
                <EnhancedAnalysisResults 
                  analysis={currentAnalysis} 
                  allAnalyses={recentAnalyses}
                />
              ) : (
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 lg:p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="p-3 lg:p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-2xl w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 lg:h-12 lg:w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-white mb-2 lg:mb-3">
                      Enhanced Analysis Ready
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 lg:mb-6 text-sm lg:text-base">
                      Enter a Wikipedia article URL or search for an article to begin comprehensive quality analysis. 
                      Get detailed insights with advanced readability metrics, citation quality assessment, and structural analysis.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3">
                        <div className="font-medium text-blue-900 dark:text-blue-300">Enhanced Metrics</div>
                        <div className="text-blue-700 dark:text-blue-400 text-xs">Gunning Fog, SMOG, Coleman-Liau</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3">
                        <div className="font-medium text-green-900 dark:text-green-300">Smart Caching</div>
                        <div className="text-green-700 dark:text-green-400 text-xs">Faster repeat analyses</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-3">
                        <div className="font-medium text-purple-900 dark:text-purple-300">Batch Processing</div>
                        <div className="text-purple-700 dark:text-purple-400 text-xs">Analyze multiple articles</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-3">
                        <div className="font-medium text-orange-900 dark:text-orange-300">Export Options</div>
                        <div className="text-orange-700 dark:text-orange-400 text-xs">PDF, CSV, JSON formats</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Batch Analysis Modal */}
      <BatchAnalysisModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onComplete={handleBatchComplete}
      />
    </div>
  );
}

export default App;