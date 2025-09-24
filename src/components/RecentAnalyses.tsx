import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { AnalysisResult } from '../types';

interface RecentAnalysesProps {
  analyses: AnalysisResult[];
  onSelect: (analysis: AnalysisResult) => void;
  current: AnalysisResult | null;
}

export function RecentAnalyses({ analyses, onSelect, current }: RecentAnalysesProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl">
          <Clock className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Analyses</h3>
      </div>

      <div className="space-y-2">
        {analyses.map((analysis, index) => (
          <button
            key={index}
            onClick={() => onSelect(analysis)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 ${
              current?.timestamp === analysis.timestamp ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700' : 'border-2 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {analysis.article.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(analysis.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(analysis.scores.overall)}`}>
                  {analysis.scores.overall}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {analyses.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
          No recent analyses yet
        </p>
      )}
    </div>
  );
}