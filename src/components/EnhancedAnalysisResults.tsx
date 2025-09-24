import React, { useState } from 'react';
import { ExternalLink, Calendar, FileText, Link2, BarChart3, Download, TrendingUp, Users, Award, ChevronLeft } from 'lucide-react';
import { AnalysisResult } from '../types';
import { EnhancedScoreCard } from './EnhancedScoreCard';
import { EnhancedSuggestionsList } from './EnhancedSuggestionsList';
import { ScoreVisualization } from './ScoreVisualization';
import { ExportService } from '../services/exportService';

interface EnhancedAnalysisResultsProps {
  analysis: AnalysisResult;
  allAnalyses?: AnalysisResult[];
}

export function EnhancedAnalysisResults({ analysis, allAnalyses = [] }: EnhancedAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { article, scores, suggestions, timestamp } = analysis;

  const getOverallRating = (score: number) => {
    if (score >= 85) return { 
      label: 'Excellent', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200',
      icon: Award
    };
    if (score >= 70) return { 
      label: 'Good', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      icon: TrendingUp
    };
    if (score >= 50) return { 
      label: 'Fair', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200',
      icon: Users
    };
    return { 
      label: 'Needs Work', 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      icon: FileText
    };
  };

  const rating = getOverallRating(scores.overall);
  const RatingIcon = rating.icon;

  const handleExport = async (format: 'pdf' | 'csv' | 'json') => {
    try {
      switch (format) {
        case 'pdf':
          await ExportService.exportToPDF(analysis);
          break;
        case 'csv':
          ExportService.exportToCSV([analysis]);
          break;
        case 'json':
          ExportService.exportToJSON([analysis]);
          break;
      }
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, shortLabel: 'Overview' },
    { id: 'detailed', label: 'Detailed Analysis', icon: FileText, shortLabel: 'Details' },
    { id: 'comparison', label: 'Historical Comparison', icon: TrendingUp, shortLabel: 'History' }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Article Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-4 lg:p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 break-words">{article.title}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Analyzed {new Date(timestamp).toLocaleDateString()}</span>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-150"
              >
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">View on Wikipedia</span>
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0 ml-4">
            <div className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border ${rating.bg} ${rating.border} flex items-center space-x-2`}>
              <RatingIcon className={`h-3 w-3 lg:h-4 lg:w-4 ${rating.color}`} />
              <span className={`font-medium text-sm lg:text-base ${rating.color}`}>{rating.label}</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-150"
              >
                <Download className="h-4 w-4 lg:h-5 lg:w-5 text-slate-600" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-150"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-150"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-150"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Quality Score</span>
              <span className="text-xl lg:text-2xl font-bold text-slate-900">{scores.overall}/100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 lg:h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 lg:h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${scores.overall}%` }}
              />
            </div>
          </div>
        </div>

        {/* Article Preview */}
        {article.extract && (
          <div className="mt-4 p-3 lg:p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
            <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
              {article.extract.substring(0, 300)}...
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg">
        <div className="border-b border-slate-200/50">
          <nav className="flex px-4 lg:px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 lg:py-4 px-2 lg:px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-150 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Score Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EnhancedScoreCard
                  title="Readability"
                  score={scores.readability.score}
                  icon={FileText}
                  details={[
                    { label: 'Flesch Score', value: `${scores.readability.fleschScore}/100` },
                    { label: 'Avg Sentence Length', value: `${scores.readability.averageSentenceLength} words` },
                    { label: 'Complex Words', value: scores.readability.complexWords.toString() },
                    ...(scores.readability.gunningFogIndex ? [{ label: 'Gunning Fog Index', value: scores.readability.gunningFogIndex.toString() }] : [])
                  ]}
                />
                
                <EnhancedScoreCard
                  title="Citations"
                  score={scores.citations.score}
                  icon={Link2}
                  details={[
                    { label: 'Total Citations', value: scores.citations.totalCitations.toString() },
                    { label: 'Inline Citations', value: scores.citations.inlineCitations.toString() },
                    { label: 'Citation Density', value: `${scores.citations.citationDensity}/1000 words` },
                    ...(scores.citations.citationQuality ? [{ label: 'Citation Quality', value: `${scores.citations.citationQuality}%` }] : [])
                  ]}
                />
                
                <EnhancedScoreCard
                  title="References"
                  score={scores.references.score}
                  icon={ExternalLink}
                  details={[
                    { label: 'Total References', value: scores.references.totalReferences.toString() },
                    { label: 'Reliable Sources', value: scores.references.reliableSources.toString() },
                    { label: 'Source Quality', value: `${Math.round(scores.references.sourceQuality)}%` },
                    ...(scores.references.academicSources ? [{ label: 'Academic Sources', value: scores.references.academicSources.toString() }] : [])
                  ]}
                />
                
                <EnhancedScoreCard
                  title="Structure"
                  score={scores.structure.score}
                  icon={BarChart3}
                  details={[
                    { label: 'Has Introduction', value: scores.structure.hasIntroduction ? 'Yes' : 'No' },
                    { label: 'Has Sections', value: scores.structure.hasSections ? 'Yes' : 'No' },
                    { label: 'Section Count', value: (scores.structure.sectionCount || 0).toString() },
                    { label: 'Section Balance', value: `${scores.structure.sectionBalance}%` }
                  ]}
                />
              </div>

              {/* Suggestions */}
              <EnhancedSuggestionsList suggestions={suggestions} />
            </div>
          )}

          {activeTab === 'detailed' && (
            <div className="space-y-4 lg:space-y-6">
              <ScoreVisualization scores={scores} />
              
              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
                  <h4 className="font-semibold text-slate-900 mb-3">Readability Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Flesch Reading Ease</span>
                      <span className="font-medium">{scores.readability.fleschScore}</span>
                    </div>
                    {scores.readability.gunningFogIndex && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Gunning Fog Index</span>
                        <span className="font-medium">{scores.readability.gunningFogIndex}</span>
                      </div>
                    )}
                    {scores.readability.smogIndex && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">SMOG Index</span>
                        <span className="font-medium">{scores.readability.smogIndex}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average Word Length</span>
                      <span className="font-medium">{scores.readability.averageWordLength} chars</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
                  <h4 className="font-semibold text-slate-900 mb-3">Source Analysis</h4>
                  <div className="space-y-2 text-sm">
                    {scores.references.academicSources !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Academic Sources</span>
                        <span className="font-medium">{scores.references.academicSources}</span>
                      </div>
                    )}
                    {scores.references.governmentSources !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Government Sources</span>
                        <span className="font-medium">{scores.references.governmentSources}</span>
                      </div>
                    )}
                    {scores.references.newsSources !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">News Sources</span>
                        <span className="font-medium">{scores.references.newsSources}</span>
                      </div>
                    )}
                    {scores.references.sourceDiversity !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Source Diversity</span>
                        <span className="font-medium">{scores.references.sourceDiversity}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && allAnalyses.length > 1 && (
            <div className="space-y-4 lg:space-y-6">
              <h4 className="font-semibold text-slate-900">Historical Comparison</h4>
              <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
                <p className="text-slate-600 text-sm">
                  Compare this analysis with your previous {allAnalyses.length - 1} analyses to track improvements over time.
                </p>
                {/* Add comparison visualization here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}