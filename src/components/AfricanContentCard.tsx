import React from 'react';
import { Globe2, BookOpen, Languages, Sparkles } from 'lucide-react';
import { AfricanContentMetrics } from '../types/wikiindaba';

interface AfricanContentCardProps {
  metrics: AfricanContentMetrics;
  recommendations: string[];
}

export function AfricanContentCard({ metrics, recommendations }: AfricanContentCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-700/50 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-orange-500 dark:bg-orange-600 rounded-xl">
          <Globe2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            African Content Analysis
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            WikiIndaba Hackathon 2025 Special Metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* African Sources */}
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                African Sources
              </span>
            </div>
            <span className={`text-lg font-bold ${getScoreColor(metrics.africanSourcesPercentage)}`}>
              {metrics.africanSourcesPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.africanSourcesPercentage)}`}
              style={{ width: `${metrics.africanSourcesPercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {metrics.africanSourcesCount} African sources found
          </p>
        </div>

        {/* Topic Relevance */}
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                African Relevance
              </span>
            </div>
            <span className={`text-lg font-bold ${getScoreColor(metrics.africanTopicRelevance)}`}>
              {metrics.africanTopicRelevance}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.africanTopicRelevance)}`}
              style={{ width: `${metrics.africanTopicRelevance}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Topic relevance to Africa
          </p>
        </div>

        {/* Local Languages */}
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Local Languages
              </span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {metrics.localLanguageReferences}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            References to African languages
          </p>
        </div>

        {/* Cultural Context */}
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Globe2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Cultural Context
              </span>
            </div>
            <span className={`text-lg font-bold ${getScoreColor(metrics.culturalContextScore)}`}>
              {metrics.culturalContextScore}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.culturalContextScore)}`}
              style={{ width: `${metrics.culturalContextScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Cultural awareness score
          </p>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Recommendations for African Content
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
