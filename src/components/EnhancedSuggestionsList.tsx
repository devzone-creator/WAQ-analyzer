import React, { useState } from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, AlertCircle, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface EnhancedSuggestionsListProps {
  suggestions: string[];
}

export function EnhancedSuggestionsList({ suggestions }: EnhancedSuggestionsListProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'important' | 'minor'>('all');
  const [expanded, setExpanded] = useState(true);

  // Enhanced suggestion categorization
  const categorizedSuggestions = suggestions.map(suggestion => {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('critical') || 
        lowerSuggestion.includes('essential') ||
        lowerSuggestion.includes('must') ||
        suggestion.includes('inline citations')) {
      return {
        text: suggestion,
        category: 'critical' as const,
        priority: 1,
        icon: AlertCircle,
        color: 'red'
      };
    }
    
    if (lowerSuggestion.includes('important') ||
        lowerSuggestion.includes('should') ||
        lowerSuggestion.includes('readability') ||
        lowerSuggestion.includes('structure')) {
      return {
        text: suggestion,
        category: 'important' as const,
        priority: 2,
        icon: AlertTriangle,
        color: 'yellow'
      };
    }
    
    if (lowerSuggestion.includes('great work') ||
        lowerSuggestion.includes('excellent')) {
      return {
        text: suggestion,
        category: 'minor' as const,
        priority: 3,
        icon: CheckCircle,
        color: 'green'
      };
    }
    
    return {
      text: suggestion,
      category: 'minor' as const,
      priority: 3,
      icon: Lightbulb,
      color: 'blue'
    };
  });

  const filteredSuggestions = filter === 'all' 
    ? categorizedSuggestions 
    : categorizedSuggestions.filter(s => s.category === filter);

  const isPositive = categorizedSuggestions.some(s => s.color === 'green');

  const getCategoryCount = (category: string) => {
    return categorizedSuggestions.filter(s => s.category === category).length;
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-50 border-red-200 hover:bg-red-100',
          icon: 'text-red-500',
          text: 'text-red-800'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
          icon: 'text-yellow-500',
          text: 'text-yellow-800'
        };
      case 'green':
        return {
          bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
          icon: 'text-emerald-500',
          text: 'text-emerald-800'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
          icon: 'text-blue-500',
          text: 'text-blue-800'
        };
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isPositive ? (
            <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-xl">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          ) : (
            <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-xl">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {isPositive ? 'Excellent Quality!' : 'Improvement Suggestions'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {filteredSuggestions.length} suggestion{filteredSuggestions.length !== 1 ? 's' : ''}
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <div className="relative group">
           <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors duration-150">
             <Filter className="h-4 w-4 text-slate-600 dark:text-slate-300" />
             <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{filter}</span>
             <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>
           <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2">
                {[
                  { value: 'all', label: 'All Suggestions', count: categorizedSuggestions.length },
                  { value: 'critical', label: 'Critical', count: getCategoryCount('critical') },
                  { value: 'important', label: 'Important', count: getCategoryCount('important') },
                  { value: 'minor', label: 'Minor', count: getCategoryCount('minor') }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-150 flex items-center justify-between ${
                      filter === option.value 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expand/Collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
           className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors duration-150"
          >
            {expanded ? (
             <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            ) : (
             <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3">
          {filteredSuggestions
            .sort((a, b) => a.priority - b.priority)
            .map((suggestion, index) => {
              const Icon = suggestion.icon;
              const colors = getColorClasses(suggestion.color);
              
              return (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-4 rounded-xl border transition-all duration-200 ${colors.bg}`}
                >
                  <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${colors.text}`}>
                      {suggestion.text}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        suggestion.category === 'critical' ? 'bg-red-100 text-red-700' :
                        suggestion.category === 'important' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {suggestion.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {!isPositive && expanded && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">Pro Tips</h4>
              <ul className="text-blue-800 dark:text-blue-400 text-sm space-y-1">
                <li>• Focus on critical issues first for maximum impact</li>
                <li>• Citations and references often provide the biggest quality boost</li>
                <li>• Break improvements into manageable chunks</li>
                <li>• Use Wikipedia's Manual of Style as a reference</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}