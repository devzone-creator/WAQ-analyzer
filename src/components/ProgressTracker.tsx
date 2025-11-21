import React from 'react';
import { TrendingUp, Target, Award, BookOpen } from 'lucide-react';

interface ProgressData {
  sessionsCompleted: number;
  averageScore: number;
  improvementTrend: number;
  masteredSkills: string[];
  commonMistakes: Array<{
    mistake: string;
    frequency: number;
  }>;
}

interface ProgressTrackerProps {
  progress: ProgressData;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 md:p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg md:text-xl font-bold text-gray-900">
          Your Learning Progress
        </h3>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-800">
            {progress.sessionsCompleted}
          </div>
          <div className="text-sm text-blue-600">Sessions Completed</div>
        </div>

        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
          <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-800">
            {progress.averageScore}%
          </div>
          <div className="text-sm text-green-600">Average Score</div>
        </div>

        <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
          <div className="text-2xl mb-2">{getTrendIcon(progress.improvementTrend)}</div>
          <div className={`text-2xl font-bold ${getTrendColor(progress.improvementTrend)}`}>
            {progress.improvementTrend > 0 ? '+' : ''}{progress.improvementTrend}%
          </div>
          <div className="text-sm text-purple-600">Improvement Trend</div>
        </div>
      </div>

      {/* Mastered Skills */}
      {progress.masteredSkills.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Mastered Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {progress.masteredSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
              >
                ✅ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {progress.commonMistakes.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Areas for Improvement
          </h4>
          <div className="space-y-2">
            {progress.commonMistakes.slice(0, 3).map((mistake, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm text-red-800">{mistake.mistake}</span>
                <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded">
                  {mistake.frequency}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};