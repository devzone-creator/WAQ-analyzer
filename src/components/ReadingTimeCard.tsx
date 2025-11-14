import React from 'react';
import { Clock, BookOpen, TrendingUp } from 'lucide-react';

interface ReadingTimeCardProps {
  readingTime: number;
  complexityLevel: string;
  wordCount: number;
  className?: string;
}

export function ReadingTimeCard({ readingTime, complexityLevel, wordCount, className = '' }: ReadingTimeCardProps) {
  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
      case 'Intermediate': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
      case 'Advanced': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30';
      case 'Expert': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30';
    }
  };

  return (
    <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Reading Information
      </h3>
      
      <div className="space-y-4">
        {/* Reading Time */}
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Reading Time</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {readingTime} min
              </div>
            </div>
          </div>
        </div>

        {/* Complexity Level */}
        <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 dark:bg-purple-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Complexity</div>
              <div className={`text-xl font-bold px-3 py-1 rounded-lg inline-block ${getComplexityColor(complexityLevel)}`}>
                {complexityLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Word Count */}
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 dark:bg-green-600 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Word Count</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {wordCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Tip:</span> {complexityLevel === 'Beginner' 
            ? 'This article is easy to read and suitable for general audiences.'
            : complexityLevel === 'Intermediate'
            ? 'This article requires some background knowledge.'
            : complexityLevel === 'Advanced'
            ? 'This article is technical and requires significant expertise.'
            : 'This article is highly specialized and requires expert knowledge.'}
        </p>
      </div>
    </div>
  );
}
