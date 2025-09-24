import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';

interface SuggestionsListProps {
  suggestions: string[];
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  const isPositive = suggestions.length === 1 && suggestions[0].includes('Great work');

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        {isPositive ? (
          <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
        ) : (
          <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-slate-900">
          {isPositive ? 'Excellent Quality!' : 'Improvement Suggestions'}
        </h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 ${
              isPositive 
                ? 'bg-emerald-50 border border-emerald-200 hover:bg-emerald-100' 
                : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isPositive ? (
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            )}
            <p className={`text-sm leading-relaxed ${
              isPositive ? 'text-emerald-800' : 'text-slate-700'
            }`}>
              {suggestion}
            </p>
          </div>
        ))}
      </div>

      {!isPositive && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-800 text-xs">
            💡 <strong>Tip:</strong> Focus on the highest-impact suggestions first. 
            Improving citations and references often provides the biggest quality boost.
          </p>
        </div>
      )}
    </div>
  );
}