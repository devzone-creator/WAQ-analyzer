import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Play, Download, AlertCircle } from 'lucide-react';
import { BatchAnalyzer, BatchAnalysisProgress } from '../services/batchAnalyzer';
import { ExportService } from '../services/exportService';
import { AnalysisResult } from '../types';

interface BatchAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: AnalysisResult[]) => void;
}

export function BatchAnalysisModal({ isOpen, onClose, onComplete }: BatchAnalysisModalProps) {
  const [articles, setArticles] = useState<string[]>(['']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<BatchAnalysisProgress | null>(null);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const addArticle = () => {
    setArticles([...articles, '']);
  };

  const removeArticle = (index: number) => {
    setArticles(articles.filter((_, i) => i !== index));
  };

  const updateArticle = (index: number, value: string) => {
    const newArticles = [...articles];
    newArticles[index] = value;
    setArticles(newArticles);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        setArticles(lines);
      };
      reader.readAsText(file);
    }
  };

  const startAnalysis = async () => {
    const validArticles = articles.filter(article => article.trim());
    if (validArticles.length === 0) return;

    setIsAnalyzing(true);
    setProgress(null);
    setResults([]);

    try {
      const analysisResults = await BatchAnalyzer.analyzeMultiple(
        validArticles,
        (progressUpdate) => setProgress(progressUpdate)
      );
      
      setResults(analysisResults);
      setShowResults(true);
      onComplete(analysisResults);
    } catch (error) {
      console.error('Batch analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      ExportService.exportToCSV(results);
    } else {
      ExportService.exportToJSON(results);
    }
  };

  const reset = () => {
    setArticles(['']);
    setProgress(null);
    setResults([]);
    setShowResults(false);
    setIsAnalyzing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Batch Analysis</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-150"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showResults ? (
            <div className="space-y-6">
              {/* Input Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Article List</h3>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors duration-150">
                      <Upload className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Upload CSV</span>
                      <input
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={addArticle}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-xl transition-colors duration-150"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Add Article</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {articles.map((article, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={article}
                        onChange={(e) => updateArticle(index, e.target.value)}
                        placeholder="Article title or Wikipedia URL"
                       className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {articles.length > 1 && (
                        <button
                          onClick={() => removeArticle(index)}
                         className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-150"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Section */}
              {(isAnalyzing || progress) && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">Analysis Progress</h4>
                  {progress && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">
                          {progress.currentArticle || 'Preparing...'}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {progress.completed} / {progress.total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                        />
                      </div>
                      {progress.errors.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-2">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {progress.errors.length} error(s) occurred
                            </span>
                          </div>
                          <div className="space-y-1">
                            {progress.errors.map((error, index) => (
                              <div key={index} className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                <strong>{error.title}:</strong> {error.error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={reset}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-150"
                >
                  Reset
                </button>
                <button
                  onClick={startAnalysis}
                  disabled={isAnalyzing || articles.filter(a => a.trim()).length === 0}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Analysis</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Analysis Complete</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">{results.length}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Articles Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                      {Math.round(results.reduce((sum, r) => sum + r.scores.overall, 0) / results.length)}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                      {results.filter(r => r.scores.overall >= 70).length}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Good Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                      {results.filter(r => r.scores.overall < 50).length}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Need Work</div>
                  </div>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white">Results</h4>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900 dark:text-white truncate">{result.article.title}</h5>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                          <span>Overall: {result.scores.overall}/100</span>
                          <span>Readability: {result.scores.readability.score}</span>
                          <span>Citations: {result.scores.citations.score}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.scores.overall >= 80 ? 'bg-green-100 text-green-700' :
                        result.scores.overall >= 60 ? 'bg-blue-100 text-blue-700' :
                        result.scores.overall >= 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {result.scores.overall}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-150"
                >
                  Back to Input
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportResults('csv')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl transition-colors duration-150"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => exportResults('json')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl transition-colors duration-150"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}