import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie } from 'recharts';
import { QualityScore } from '../types';

interface ScoreVisualizationProps {
  scores: QualityScore;
}

export function ScoreVisualization({ scores }: ScoreVisualizationProps) {
  const barData = [
    { name: 'Readability', score: scores.readability.score, color: '#3B82F6' },
    { name: 'Citations', score: scores.citations.score, color: '#10B981' },
    { name: 'References', score: scores.references.score, color: '#F59E0B' },
    { name: 'Structure', score: scores.structure.score, color: '#8B5CF6' }
  ];

  const radarData = [
    { subject: 'Readability', score: scores.readability.score, fullMark: 100 },
    { subject: 'Citations', score: scores.citations.score, fullMark: 100 },
    { subject: 'References', score: scores.references.score, fullMark: 100 },
    { subject: 'Structure', score: scores.structure.score, fullMark: 100 }
  ];

  const pieData = [
    { name: 'Achieved', value: scores.overall, color: '#3B82F6' },
    { name: 'Remaining', value: 100 - scores.overall, color: '#E5E7EB' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#3B82F6';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <h4 className="text-lg font-semibold text-slate-900">Score Visualization</h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h5 className="font-medium text-slate-900 mb-4">Score Breakdown</h5>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h5 className="font-medium text-slate-900 mb-4">Quality Profile</h5>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis 
                tick={{ fontSize: 10, fill: '#6B7280' }}
                className="text-xs"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fontSize: 8, fill: '#6B7280' }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Score Pie */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h5 className="font-medium text-slate-900 mb-4">Overall Progress</h5>
          <div className="flex items-center justify-center relative">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{scores.overall}</span>
              <span className="text-sm text-slate-600">/ 100</span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h5 className="font-medium text-slate-900 mb-4">Key Metrics</h5>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Flesch Reading Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 lg:w-16 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${scores.readability.fleschScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-6 lg:w-8 text-right">
                  {scores.readability.fleschScore}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Citation Density</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 lg:w-16 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, scores.citations.citationDensity * 10)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-6 lg:w-8 text-right">
                  {scores.citations.citationDensity}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Source Quality</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 lg:w-16 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${scores.references.sourceQuality}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-6 lg:w-8 text-right">
                  {Math.round(scores.references.sourceQuality)}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Section Balance</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 lg:w-16 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${scores.structure.sectionBalance}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-6 lg:w-8 text-right">
                  {scores.structure.sectionBalance}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}