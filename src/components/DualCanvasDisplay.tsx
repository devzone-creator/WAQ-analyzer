import React from 'react';
import { AlertCircle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { CorrectionItem } from '../types/training';
import { ExportButtons } from './ExportButtons';
import { getTranslation } from '../i18n/translations';
import { SupportedLanguage } from '../types/wikiindaba';

interface DualCanvasDisplayProps {
  originalText: string;
  corrections: CorrectionItem[];
  language: string;
}

export const DualCanvasDisplay: React.FC<DualCanvasDisplayProps> = ({
  originalText,
  corrections,
  language
}) => {
  const t = getTranslation(language as SupportedLanguage);
  const lines = originalText.split('\n');
  
  const getCorrectedText = (): string => {
    let corrected = originalText;
    
    // Apply corrections (simplified - in production, use more sophisticated text replacement)
    corrections.forEach(correction => {
      if (correction.correctedText) {
        corrected = corrected.replace(correction.originalText, correction.correctedText);
      }
    });
    
    return corrected;
  };

  const getLineCorrections = (lineNum: number): CorrectionItem[] => {
    return corrections.filter(c => c.line === lineNum);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'important':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'important':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <>
      <ExportButtons 
        originalText={originalText}
        corrections={corrections}
        language={language}
      />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Analysis Results</h3>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-gray-700">
              {corrections.filter(c => c.severity === 'critical').length} {t.critical}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-gray-700">
              {corrections.filter(c => c.severity === 'important').length} {t.important}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700">
              {corrections.filter(c => c.severity === 'recommended').length} {t.suggestions}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Original Text Panel */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-3 md:px-4 py-2 border-b border-gray-300">
            <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t.originalText}</h4>
          </div>
          <div className="p-4 bg-white max-h-96 overflow-y-auto">
            {lines.map((line, idx) => {
              const lineCorrections = getLineCorrections(idx + 1);
              const hasIssues = lineCorrections.length > 0;
              
              return (
                <div key={idx} className="mb-2">
                  <div className={`p-2 rounded ${hasIssues ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
                    <span className="text-sm text-gray-500 mr-2">{idx + 1}</span>
                    <span className="font-mono text-sm">{line || ' '}</span>
                  </div>
                  {hasIssues && (
                    <div className="ml-8 mt-1 space-y-1">
                      {lineCorrections.map((correction, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2 text-xs">
                          {getSeverityIcon(correction.severity)}
                          <span className="text-gray-700">{correction.explanation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Corrected Text Panel */}
        <div className="border border-green-300 rounded-lg overflow-hidden">
          <div className="bg-green-100 px-3 md:px-4 py-2 border-b border-green-300">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm md:text-base">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              {t.improvedVersion}
            </h4>
          </div>
          <div className="p-4 bg-white max-h-96 overflow-y-auto">
            <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800">
              {getCorrectedText()}
            </pre>
          </div>
        </div>
      </div>

      {/* Detailed Corrections */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">Learning Points</h4>
        <div className="space-y-3">
          {corrections.map((correction, idx) => (
            <div key={idx} className={`border rounded-lg p-4 ${getSeverityColor(correction.severity)}`}>
              <div className="flex items-start gap-3">
                {getSeverityIcon(correction.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 capitalize">
                      {correction.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white rounded">
                      Line {correction.line}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{correction.explanation}</p>
                  {correction.originalText && correction.correctedText && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-mono">
                        {correction.originalText}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono">
                        {correction.correctedText}
                      </span>
                    </div>
                  )}
                  <a
                    href={correction.guidelineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Learn more about this guideline →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};
