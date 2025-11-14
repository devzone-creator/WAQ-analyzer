import React, { useState, useEffect, useCallback } from 'react';
import { FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { WikipediaGuideline } from '../types/guidelines';

interface ArticleEditorProps {
  onContentChange: (content: string) => void;
  initialContent?: string;
}

interface Issue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  guideline: string;
  suggestion?: string;
}

export function ArticleEditor({ onContentChange, initialContent = '' }: ArticleEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
    
    // Debounced analysis would happen here
    analyzeContent(newContent);
  }, [onContentChange]);

  const analyzeContent = (text: string) => {
    const foundIssues: Issue[] = [];
    const lines = text.split('\n');

    lines.forEach((line, index) => {
      // Check for weasel words
      const weaselWords = ['some people', 'many believe', 'it is said', 'arguably', 'clearly'];
      weaselWords.forEach(word => {
        if (line.toLowerCase().includes(word)) {
          foundIssues.push({
            type: 'warning',
            message: `Weasel word detected: "${word}"`,
            line: index + 1,
            guideline: 'WP:WEASEL',
            suggestion: 'Specify who says this or remove the claim'
          });
        }
      });

      // Check for peacock terms
      const peacockTerms = ['legendary', 'iconic', 'world-famous', 'best', 'greatest'];
      peacockTerms.forEach(term => {
        if (line.toLowerCase().includes(term)) {
          foundIssues.push({
            type: 'warning',
            message: `Peacock term detected: "${term}"`,
            line: index + 1,
            guideline: 'WP:PEACOCK',
            suggestion: 'Use neutral, factual language'
          });
        }
      });

      // Check for missing citations (sentences without refs)
      if (line.length > 50 && !line.includes('<ref') && !line.includes('[')) {
        const sentences = line.split(/[.!?]+/).filter(s => s.trim().length > 20);
        if (sentences.length > 0) {
          foundIssues.push({
            type: 'info',
            message: 'Consider adding a citation',
            line: index + 1,
            guideline: 'WP:CITE',
            suggestion: 'Add <ref>source</ref> after factual claims'
          });
        }
      }
    });

    setIssues(foundIssues);
  };

  const getIssueIcon = (type: Issue['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Article Editor
          </h2>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span className="flex items-center space-x-1">
            {issues.filter(i => i.type === 'error').length === 0 ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400">No errors</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600 dark:text-red-400">
                  {issues.filter(i => i.type === 'error').length} errors
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your Wikipedia article here... 

Example:
'''Article Title''' is a [description]. It was founded in [year].<ref>Source citation</ref>

== History ==
The history section describes...

== References ==
<references />"
          className="w-full h-96 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white font-mono text-sm resize-y"
          spellCheck={true}
        />
      </div>

      {/* Issues Panel */}
      {issues.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Issues & Suggestions ({issues.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {issues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                {getIssueIcon(issue.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Line {issue.line}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      {issue.guideline}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {issue.message}
                  </p>
                  {issue.suggestion && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                      💡 {issue.suggestion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Quick Wikipedia Writing Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Use <code className="px-1 bg-blue-100 dark:bg-blue-900/40 rounded">'''bold'''</code> for the article title in the first sentence</li>
          <li>• Add citations with <code className="px-1 bg-blue-100 dark:bg-blue-900/40 rounded">&lt;ref&gt;source&lt;/ref&gt;</code></li>
          <li>• Create sections with <code className="px-1 bg-blue-100 dark:bg-blue-900/40 rounded">== Section Name ==</code></li>
          <li>• Maintain neutral point of view (NPOV) - avoid promotional language</li>
          <li>• Include a References section at the end</li>
        </ul>
      </div>
    </div>
  );
}
