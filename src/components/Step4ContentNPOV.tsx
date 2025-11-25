import React, { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { ContentAndNPOVData } from '../types/waca';
import { NeutralityDialService } from '../services/neutralityDialService';

interface Step4ContentNPOVProps {
  data: ContentAndNPOVData;
  onUpdate: (data: ContentAndNPOVData) => void;
  onNext: () => void;
  isLoading: boolean;
}

export const Step4ContentNPOV: React.FC<Step4ContentNPOVProps> = ({
  data,
  onUpdate,
  onNext,
  isLoading
}) => {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const handleContentChange = (content: string) => {
    const npovScore = NeutralityDialService.calculateNPOVScore(content);
    onUpdate({
      bodyContent: content,
      npovScore
    });
  };

  // Compute highlighted text
  const highlightedContent = useMemo(() => {
    if (!data.bodyContent || data.npovScore.highlightedTerms.length === 0) {
      return data.bodyContent;
    }

    const text = data.bodyContent;
    const parts: Array<{ text: string; term: string | null; weight: number }> = [];
    let lastIndex = 0;

    // Sort terms by position
    const sortedTerms = [...data.npovScore.highlightedTerms].sort(
      (a, b) => a.position - b.position
    );

    for (const term of sortedTerms) {
      if (term.position > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, term.position),
          term: null,
          weight: 0
        });
      }

      parts.push({
        text: text.substring(term.position, term.position + term.length),
        term: term.term,
        weight: term.weight
      });

      lastIndex = term.position + term.length;
    }

    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        term: null,
        weight: 0
      });
    }

    return parts;
  }, [data.bodyContent, data.npovScore.highlightedTerms]);

  const getThresholdColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'text-green-700 bg-green-50';
      case 'yellow':
        return 'text-yellow-700 bg-yellow-50';
      case 'red':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getHighlightColor = (weight: number) => {
    if (weight === 3) return 'bg-red-200 text-red-900 font-semibold';
    if (weight === 2) return 'bg-yellow-200 text-yellow-900 font-semibold';
    if (weight === -1) return 'bg-green-200 text-green-900';
    return '';
  };

  const termSuggestions =
    selectedTerm && data.npovScore.highlightedTerms.find(t => t.term === selectedTerm)
      ? NeutralityDialService.getSuggestions(selectedTerm)
      : [];

  return (
    <div className="w-full max-w-4xl">
      {/* Neutrality Dial Gauge */}
      <div className={`rounded-lg border-2 p-6 mb-6 ${getThresholdColor(data.npovScore.thresholdStatus)}`}>
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Real-time Neutrality Dial</h3>
          <p className="text-sm opacity-80">
            NPOV Score: {data.npovScore.normalizedScore.toFixed(6)} / Maximum threshold: 0.05
          </p>
        </div>

        {/* Gauge bar */}
        <div className="w-full bg-gray-300 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              data.npovScore.thresholdStatus === 'green'
                ? 'bg-green-500'
                : data.npovScore.thresholdStatus === 'yellow'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{
              width: `${Math.min((data.npovScore.normalizedScore / 0.1) * 100, 100)}%`
            }}
          />
        </div>

        {/* Threshold indicators */}
        <div className="flex justify-between text-xs font-semibold mb-4">
          <span>0.00</span>
          <span>0.02 (Green)</span>
          <span>0.05 (Yellow → Red)</span>
        </div>

        {/* Status icon and message */}
        <div className="flex items-start gap-3">
          {data.npovScore.thresholdStatus === 'green' && (
            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
          )}
          {data.npovScore.thresholdStatus === 'yellow' && (
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          )}
          {data.npovScore.thresholdStatus === 'red' && (
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold mb-1">{data.npovScore.feedback}</p>
            <p className="text-sm opacity-75">
              {data.npovScore.highlightedTerms.length} promotional/subjective terms detected in{' '}
              {data.npovScore.wordCount} words.
            </p>
          </div>
        </div>
      </div>

      {/* Content Input */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <label className="block font-semibold text-lg mb-3">Article Body Content</label>
        <p className="text-sm text-gray-600 mb-3">
          Write your article content. Highlighted words violate NPOV policy.
        </p>

        <textarea
          value={data.bodyContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write your article content here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={12}
        />

        <p className="text-xs text-gray-500 mt-2">
          Word count: {data.npovScore.wordCount} | Promotional density:{' '}
          {(data.npovScore.normalizedScore * 100).toFixed(2)}%
        </p>
      </div>

      {/* Highlighted Terms Legend */}
      {data.npovScore.highlightedTerms.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Detected Terms</h3>

          <div className="space-y-2">
            {data.npovScore.highlightedTerms.map((term, index) => (
              <button
                key={index}
                onClick={() => setSelectedTerm(term.term)}
                className={`
                  w-full text-left p-3 rounded-lg border border-gray-200 transition
                  ${selectedTerm === term.term ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-sm ${getHighlightColor(
                        term.weight
                      )}`}
                    >
                      "{term.term}"
                    </span>
                    <span className="text-sm text-gray-600">
                      {term.weight === 3
                        ? 'High violation (3 pts)'
                        : term.weight === 2
                          ? 'Subjective (2 pts)'
                          : 'Neutralizer (-1 pt)'}
                    </span>
                  </div>
                </div>

                {selectedTerm === term.term && termSuggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Suggestions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                      {termSuggestions.map((suggestion, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formatted Content Preview */}
      <div className="bg-gray-50 rounded-lg border border-gray-300 p-6 mb-6">
        <p className="font-semibold text-gray-900 mb-3">Content with Highlighting</p>
        <div className="bg-white p-4 rounded border border-gray-200 text-sm leading-relaxed">
          {typeof highlightedContent === 'string' ? (
            highlightedContent
          ) : (
            <span>
              {highlightedContent.map((part, index) =>
                part.term ? (
                  <span key={index} className={`${getHighlightColor(part.weight)}`}>
                    {part.text}
                  </span>
                ) : (
                  <span key={index}>{part.text}</span>
                )
              )}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          disabled={
            !data.bodyContent.trim() ||
            data.npovScore.thresholdStatus === 'red' ||
            isLoading
          }
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold transition
            ${
              data.npovScore.thresholdStatus === 'red' ||
              !data.bodyContent.trim() ||
              isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {data.npovScore.thresholdStatus === 'red'
            ? 'Fix Promotional Language to Continue'
            : isLoading
              ? 'Processing...'
              : 'NPOV Verified ✓ - Next Step'}
        </button>
      </div>
    </div>
  );
};
