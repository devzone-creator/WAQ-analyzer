import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Languages, Lightbulb, Search, Loader2 } from 'lucide-react';
import { SupportedLanguage } from '../types/wikiindaba';
import { AnalysisMode } from '../types/training';

interface TrainingCanvasProps {
  onAnalyze: (text: string, language: SupportedLanguage, mode: AnalysisMode) => void;
}

const languageFlags: Record<SupportedLanguage, string> = {
  'en': '🇬🇧',
  'fr': '🇫🇷',
  'ar': '🇸🇦',
  'sw': '🇹🇿',
  'ha': '🇳🇬',
  'yo': '🇳🇬',
  'am': '🇪🇹',
  'zu': '🇿🇦'
};

const languageNames: Record<SupportedLanguage, string> = {
  'en': 'English',
  'fr': 'Français',
  'ar': 'العربية',
  'sw': 'Kiswahili',
  'ha': 'Hausa',
  'yo': 'Yorùbá',
  'am': 'አማρኛ',
  'zu': 'isiZulu'
};

export const TrainingCanvas: React.FC<TrainingCanvasProps> = ({ onAnalyze }) => {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [mode, setMode] = useState<'paste' | 'article'>('paste');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Search Wikipedia articles
  useEffect(() => {
    if (mode !== 'article' || searchQuery.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchQuery)}&limit=8&namespace=0&format=json&origin=*`
        );
        const data = await response.json();
        setSearchResults(data[1] || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, mode]);

  const handleSelectArticle = async (title: string) => {
    setSearchQuery(title);
    setShowResults(false);
    setIsSearching(true);

    try {
      // Fetch article content
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`
      );
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract || '';
      
      // Limit to first 3000 characters for analysis
      const limitedText = extract.substring(0, 3000);
      setInputText(limitedText);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to fetch article. Please try pasting the text directly.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyze = () => {
    const analysisMode: AnalysisMode = {
      type: mode === 'paste' ? 'paste-analyze' : 'article-study',
      showCorrections: true,
      showExplanations: true,
      highlightIssues: true
    };
    onAnalyze(inputText, selectedLanguage, analysisMode);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <BookOpen className="w-7 h-7 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AtiQr Training Canvas</h2>
            <p className="text-sm text-gray-600">Learn Wikipedia writing through practice</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Languages className="w-5 h-5 text-gray-600" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900 font-medium"
          >
            {(Object.keys(languageFlags) as SupportedLanguage[]).map(lang => (
              <option key={lang} value={lang}>
                {languageFlags[lang]} {languageNames[lang]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('paste')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all border-2 ${
            mode === 'paste'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste & Analyze
        </button>
        <button
          onClick={() => setMode('article')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all border-2 ${
            mode === 'article'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Study Article
        </button>
      </div>

      {mode === 'article' && (
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search for a Wikipedia article to analyze:
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Wikipedia articles... (e.g., 'Nelson Mandela', 'Python programming')"
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((title, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectArticle(title)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-200 last:border-b-0 flex items-center gap-3 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'paste' 
            ? 'Paste your draft paragraph or article:' 
            : 'Article content (auto-filled from search or paste manually):'}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={mode === 'paste'
            ? 'Write or paste your Wikipedia draft here...\n\nExample: "This legendary company is clearly the best in Africa. Many people believe it has revolutionized the industry."'
            : 'Search for an article above, or paste Wikipedia article text here to analyze...'
          }
          className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none font-mono text-sm"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {inputText.length} characters • {inputText.split(/\s+/).filter(w => w).length} words
          </span>
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Analyze & Learn
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-gray-700 mt-0.5" />
          <div className="text-sm text-gray-800">
            <p className="font-semibold mb-1 text-gray-900">How AtiQr helps you learn:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Identifies citation issues, biased language, and style problems</li>
              <li>Shows corrections side-by-side with explanations</li>
              <li>Links to Wikipedia guidelines for deeper learning</li>
              <li>Tracks your progress and common mistakes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );};