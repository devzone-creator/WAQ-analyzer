import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  details: Array<{ label: string; value: string }>;
}

export function ScoreCard({ title, score, icon: Icon, details }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-emerald-600';
    if (score >= 60) return 'from-blue-400 to-blue-600';
    if (score >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700';
    if (score >= 60) return 'text-blue-700';
    if (score >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
            <Icon className="h-5 w-5 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <div className={`text-2xl font-bold ${getScoreTextColor(score)}`}>
          {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${getScoreColor(score)} h-2 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-slate-600">{detail.label}</span>
            <span className="font-medium text-slate-900">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}