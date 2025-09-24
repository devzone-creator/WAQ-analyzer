import React from 'react';
import { ExternalLink, Calendar, FileText, Link2, BarChart3, CheckCircle } from 'lucide-react';
import { AnalysisResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { SuggestionsList } from './SuggestionsList';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { article, scores, suggestions, timestamp } = analysis;

  const getOverallRating = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 70) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (score >= 50) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const rating = getOverallRating(scores.overall);

  return (
    <div className="space-y-6">
      {/* Article Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{article.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Analyzed {new Date(timestamp).toLocaleDateString()}</span>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-150"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Wikipedia</span>
              </a>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border ${rating.bg} ${rating.border}`}>
            <span className={`font-medium ${rating.color}`}>{rating.label}</span>
          </div>
        </div>

        {/* Overall Score */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Quality Score</span>
              <span className="text-2xl font-bold text-slate-900">{scores.overall}/100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${scores.overall}%` }}
              />
            </div>
          </div>
        </div>

        {/* Article Preview */}
        {article.extract && (
          <div className="mt-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
            <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
              {article.extract.substring(0, 300)}...
            </p>
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreCard
          title="Readability"
          score={scores.readability.score}
          icon={FileText}
          details={[
            { label: 'Flesch Score', value: `${scores.readability.fleschScore}/100` },
            { label: 'Avg Sentence Length', value: `${scores.readability.averageSentenceLength} words` },
            { label: 'Complex Words', value: scores.readability.complexWords.toString() }
          ]}
        />
        
        <ScoreCard
          title="Citations"
          score={scores.citations.score}
          icon={Link2}
          details={[
            { label: 'Total Citations', value: scores.citations.totalCitations.toString() },
            { label: 'Inline Citations', value: scores.citations.inlineCitations.toString() },
            { label: 'Citation Density', value: `${scores.citations.citationDensity}/1000 words` }
          ]}
        />
        
        <ScoreCard
          title="References"
          score={scores.references.score}
          icon={ExternalLink}
          details={[
            { label: 'Total References', value: scores.references.totalReferences.toString() },
            { label: 'Reliable Sources', value: scores.references.reliableSources.toString() },
            { label: 'Source Quality', value: `${Math.round(scores.references.sourceQuality)}%` }
          ]}
        />
        
        <ScoreCard
          title="Structure"
          score={scores.structure.score}
          icon={BarChart3}
          details={[
            { label: 'Has Introduction', value: scores.structure.hasIntroduction ? 'Yes' : 'No' },
            { label: 'Has Sections', value: scores.structure.hasSections ? 'Yes' : 'No' },
            { label: 'Section Balance', value: `${scores.structure.sectionBalance}%` }
          ]}
        />
      </div>

      {/* Suggestions */}
      <SuggestionsList suggestions={suggestions} />
    </div>
  );
}