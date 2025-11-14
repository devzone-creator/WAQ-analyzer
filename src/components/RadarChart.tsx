import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { QualityScore } from '../types';

interface RadarChartProps {
  scores: QualityScore;
  className?: string;
}

export function QualityRadarChart({ scores, className = '' }: RadarChartProps) {
  const data = [
    {
      metric: 'Readability',
      score: scores.readability.score,
      fullMark: 100,
    },
    {
      metric: 'Citations',
      score: scores.citations.score,
      fullMark: 100,
    },
    {
      metric: 'References',
      score: scores.references.score,
      fullMark: 100,
    },
    {
      metric: 'Structure',
      score: scores.structure.score,
      fullMark: 100,
    },
  ];

  return (
    <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Quality Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Radar
            name="Quality Score"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Legend />
        </RechartsRadar>
      </ResponsiveContainer>
      
      {/* Score Summary */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
          <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Readability</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{scores.readability.score}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
          <div className="text-xs text-green-700 dark:text-green-300 font-medium">Citations</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">{scores.citations.score}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
          <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">References</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{scores.references.score}</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3">
          <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">Structure</div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{scores.structure.score}</div>
        </div>
      </div>
    </div>
  );
}
