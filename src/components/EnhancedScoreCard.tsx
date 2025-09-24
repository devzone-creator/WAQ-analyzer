import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface EnhancedScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  details: Array<{ label: string; value: string }>;
}

export function EnhancedScoreCard({ title, score, icon: Icon, details }: EnhancedScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-emerald-400 to-emerald-600';
    if (score >= 70) return 'from-blue-400 to-blue-600';
    if (score >= 50) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700';
    if (score >= 70) return 'text-blue-700';
    if (score >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { text: 'Excellent', bg: 'bg-emerald-100', color: 'text-emerald-700' };
    if (score >= 70) return { text: 'Good', bg: 'bg-blue-100', color: 'text-blue-700' };
    if (score >= 50) return { text: 'Fair', bg: 'bg-yellow-100', color: 'text-yellow-700' };
    return { text: 'Poor', bg: 'bg-red-100', color: 'text-red-700' };
  };

  const badge = getScoreBadge(score);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl group-hover:from-slate-200 group-hover:to-slate-300 dark:group-hover:from-slate-600 dark:group-hover:to-slate-500 transition-all duration-300">
            <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
              {badge.text}
            </div>
          </div>
        </div>
        <div className={`text-3xl font-bold ${getScoreTextColor(score)}`}>
          {score}
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${getScoreColor(score)} h-3 rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${score}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Enhanced Details */}
      <div className="space-y-3">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center text-sm group/detail">
            <span className="text-slate-600 dark:text-slate-300 group-hover/detail:text-slate-700 dark:group-hover/detail:text-slate-200 transition-colors duration-150">
              {detail.label}
            </span>
            <span className="font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md group-hover/detail:bg-slate-100 dark:group-hover/detail:bg-slate-600 transition-colors duration-150">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Score Interpretation */}
      <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {score >= 85 && "Outstanding quality - minimal improvements needed"}
          {score >= 70 && score < 85 && "Good quality - minor enhancements recommended"}
          {score >= 50 && score < 70 && "Fair quality - moderate improvements needed"}
          {score < 50 && "Needs significant improvement"}
        </div>
      </div>
    </div>
  );
}