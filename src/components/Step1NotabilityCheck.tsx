import React, { useState } from 'react';
import { Plus, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { NotabilityCheckData } from '../types/waca';
import { SourceCredibilityService } from '../services/sourceCredibilityService';

interface Step1NotabilityCheckProps {
  data: NotabilityCheckData;
  onUpdate: (data: NotabilityCheckData) => Promise<void>;
  onNext: () => void;
  isLoading: boolean;
}

export const Step1NotabilityCheck: React.FC<Step1NotabilityCheckProps> = ({
  data,
  onUpdate,
  onNext,
  isLoading
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [validating, setValidating] = useState(false);

  const handleAddSource = async () => {
    if (!urlInput.trim()) {
      alert('Please enter a URL');
      return;
    }

    setValidating(true);
    try {
      const newSource = await SourceCredibilityService.validateSource(
        urlInput,
        titleInput || urlInput
      );

      const updatedSources = [...data.sources, newSource];
      const validation = await SourceCredibilityService.validateNotability(
        updatedSources
      );

      await onUpdate({
        sources: updatedSources,
        gngProven: validation.gngProven,
        validationMessage: validation.message
      });

      setUrlInput('');
      setTitleInput('');
    } catch (error) {
      console.error('Error validating source:', error);
      alert('Failed to validate source. Please check the URL and try again.');
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveSource = async (index: number) => {
    const updatedSources = data.sources.filter((_, i) => i !== index);
    const validation = await SourceCredibilityService.validateNotability(
      updatedSources
    );

    await onUpdate({
      sources: updatedSources,
      gngProven: validation.gngProven,
      validationMessage: validation.message
    });
  };

  const openFlagIssue = (sourceUrl: string, sourceTitle: string, tier: string, verified: boolean) => {
    const title = `Flag source: ${sourceTitle || sourceUrl}`;
    const bodyLines = [
      `Please review this source classification.`,
      ``,
      `URL: ${sourceUrl}`,
      `Credibility tier: ${tier}`,
      `Verified: ${verified}`,
      ``,
      `Notes: (describe why you think this classification is incorrect)`
    ];
    const params = new URLSearchParams();
    params.set('title', title);
    params.set('body', bodyLines.join('\n'));
    const url = `https://github.com/devzone-creator/WAQ-analyzer/issues/new?${params.toString()}`;
    window.open(url, '_blank');
  };

  const credibilityColor = (tier: string) => {
    switch (tier) {
      case 'high':
        return 'text-green-700 bg-green-50';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50';
      case 'low':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 mb-2">
            General Notability Guideline (GNG)
          </p>
          <p className="text-sm text-blue-800">
            Add at least 3 independent, reliable sources to prove notability. Wikipedia requires
            significant coverage from independent publications, not the subject's own website or
            social media.
          </p>
        </div>
      </div>

      {/* Source Input */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Add Reliable Sources</h3>

        <div className="space-y-3 mb-4">
          <input
            type="url"
            placeholder="https://example.com/article"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={validating}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="text"
            placeholder="Article title (optional)"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            disabled={validating}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleAddSource}
            disabled={validating || !urlInput.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            {validating ? 'Validating...' : 'Add Source'}
          </button>
        </div>

        {data.validationMessage && (
          <div
            className={`p-3 rounded-lg flex gap-2 ${
              data.gngProven
                ? 'bg-green-50 text-green-700 border border-green-300'
                : 'bg-yellow-50 text-yellow-700 border border-yellow-300'
            }`}
          >
            {data.gngProven ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{data.validationMessage}</span>
          </div>
        )}
      </div>

      {/* Sources List */}
      {data.sources.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Added Sources ({data.sources.length})</h3>

          <div className="space-y-3">
            {data.sources.map((source, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{source.title}</p>
                    <p className="text-sm text-gray-600 truncate">{source.url}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSource(index)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${credibilityColor(
                      source.credibilityTier
                    )}`}
                  >
                    {source.credibilityTier === 'high'
                      ? '✓ High Credibility'
                      : source.credibilityTier === 'medium'
                        ? '⚠ Medium Credibility'
                        : source.credibilityTier === 'low'
                          ? '✗ Low Credibility'
                          : '? Unknown'}
                  </span>

                  {source.isIndependent ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                      ✓ Independent
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 font-semibold">
                      ✗ Not Independent
                    </span>
                  )}

                  {source.verified ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 font-semibold">
                      ✗ Verification Failed
                    </span>
                  )}
                </div>

                {source.verificationError && (
                  <p className="text-xs text-red-600 mt-2">{source.verificationError}</p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openFlagIssue(source.url, source.title, source.credibilityTier, !!source.verified)}
                    className="px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
                  >
                    Flag Source
                  </button>
                  <button
                    onClick={() => window.open(source.url.startsWith('http') ? source.url : `https://${source.url}`, '_blank')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
                  >
                    Open Source
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credibility Guide */}
      <div className="bg-gray-50 rounded-lg border border-gray-300 p-4 mb-6">
        <p className="font-semibold text-gray-900 mb-3">Source Credibility Tiers</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-green-50 p-3 rounded border border-green-300">
            <p className="font-semibold text-green-900">High</p>
            <p className="text-green-800">Academic, government, major news</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
            <p className="font-semibold text-yellow-900">Medium</p>
            <p className="text-yellow-800">Professional publications, industry news</p>
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-300">
            <p className="font-semibold text-red-900">Low</p>
            <p className="text-red-800">Social media, blogs, forums</p>
          </div>
          <div className="bg-gray-200 p-3 rounded border border-gray-400">
            <p className="font-semibold text-gray-900">Unknown</p>
            <p className="text-gray-800">Needs verification</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          disabled={!data.gngProven || isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {isLoading ? 'Processing...' : 'Notability Verified ✓ - Next Step'}
        </button>
      </div>
    </div>
  );
};
