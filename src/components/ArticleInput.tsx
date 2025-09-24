import React, { useState, useEffect } from 'react';
import { Search, Link, Loader2, FileText } from 'lucide-react';
import { WikipediaService } from '../services/wikipediaApi';

interface ArticleInputProps {
  onAnalyze: (input: string) => void;
  isLoading: boolean;
}

export function ArticleInput({ onAnalyze, isLoading }: ArticleInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (input.length > 2 && !input.includes('wikipedia.org')) {
        setSearchLoading(true);
        try {
          const results = await WikipediaService.searchArticles(input);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    onAnalyze(suggestion);
  };

  const isUrl = input.includes('wikipedia.org');

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 lg:p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analyze Article</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Enter a Wikipedia URL or search for an article by title
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isUrl ? (
              <Link className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            ) : (
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isUrl ? "https://en.wikipedia.org/wiki/..." : "Search articles..."}
            className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
            disabled={isLoading}
          />
          {searchLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-4 w-4 text-slate-400 dark:text-slate-500 animate-spin" />
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-b-0 flex items-center space-x-3 transition-colors duration-150"
              >
                <FileText className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 truncate">{suggestion}</span>
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg text-sm lg:text-base"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Analyze Quality
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Examples:</p>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => setInput('Climate change')}
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150"
          >
            Climate change
          </button>
          <button
            onClick={() => setInput('Artificial intelligence')}
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-150"
          >
            Artificial intelligence
          </button>
        </div>
      </div>
    </div>
  );
}