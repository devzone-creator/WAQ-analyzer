import React from 'react';
import { Brain, Target, Eye, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { AIAnalysisResult, AISuggestion, BiasDetection } from '../services/ai/aiService';
import { getTranslation } from '../i18n/translations';
import { SupportedLanguage } from '../types/wikiindaba';

interface AIAnalysisDisplayProps {
  analysis: AIAnalysisResult;
  language: SupportedLanguage;
}

export const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({
  analysis,
  language
}) => {
  const t = getTranslation(language);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 md:p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg md:text-xl font-bold text-gray-900">
          AI-Powered Analysis
        </h3>
      </div>

      {/* AI Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg border-2 border-gray-200">
          <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className={`text-2xl font-bold ${getScoreColor(analysis.qualityScore)}`}>
            {analysis.qualityScore}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Overall Quality</div>
        </div>

        <div className="text-center p-4 rounded-lg border-2 border-gray-200">
          <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className={`text-2xl font-bold ${getScoreColor(analysis.biasScore)}`}>
            {analysis.biasScore}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Neutrality Score</div>
        </div>

        <div className="text-center p-4 rounded-lg border-2 border-gray-200">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
            {analysis.readabilityScore}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Readability</div>
        </div>
      </div>

      {/* AI Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Suggestions
          </h4>
          <div className="space-y-3">
            {analysis.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`border-l-4 p-3 rounded-r-lg ${
                  suggestion.priority === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : suggestion.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  {suggestion.priority === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {suggestion.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {suggestion.explanation}
                    </p>
                    {suggestion.originalText && suggestion.suggestedText && (
                      <div className="mt-2 text-xs">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded mr-2">
                          {suggestion.originalText}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded ml-2">
                          {suggestion.suggestedText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bias Detection */}
      {analysis.biasedPhrases.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Bias Detection
          </h4>
          <div className="space-y-2">
            {analysis.biasedPhrases.map((bias, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 ${getSeverityColor(bias.severity)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                    "{bias.phrase}"
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    bias.severity === 'high' ? 'bg-red-200 text-red-800' :
                    bias.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {bias.biasType} bias
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  💡 {bias.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Improvements */}
      {analysis.improvements.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-600" />
            Style Improvements
          </h4>
          <div className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="border border-green-300 rounded-lg p-3 bg-green-50">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-mono">
                    {improvement.originalPhrase}
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono">
                    {improvement.improvedPhrase}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {improvement.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};