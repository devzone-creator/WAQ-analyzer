import React, { useState, useEffect, useCallback } from 'react';
import { FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { WikipediaGuideline } from '../types/guidelines';
import { unified } from 'unified';
import retext from 'retext';
import retextEquality from 'retext-equality';

interface ArticleEditorProps {
  onContentChange: (content: string) => void;
  initialContent?: string;
}

interface Issue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column?: number;
  guideline: string;
  suggestion?: string;
}

export function ArticleEditor({ onContentChange, initialContent = '' }: ArticleEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  const getAISuggestions = () => {
    setIsLoadingAI(true);
    setIsModalOpen(true);
    setAiSuggestions([]);

    setTimeout(() => {
      const exampleSuggestions = [
        "The lead section could be expanded to better summarize the article's key points.",
        "Consider rephrasing the sentence 'It is an amazing achievement' to be more neutral, for example: 'It is regarded by critics as a significant achievement.'",
        "The 'History' section would benefit from more citations from reliable sources to support its claims.",
        "To improve neutrality, attribute the claim 'the best product on the market' to a specific source.",
        "Consider adding an 'Impact' section to discuss the subject's influence and legacy."
      ];
      setAiSuggestions(exampleSuggestions);
      setIsLoadingAI(false);
    }, 2000);
  };

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
    
    // Debounced analysis would happen here
    analyzeContent(newContent);
  }, [onContentChange]);

  const analyzeContent = (text: string) => {
    const foundIssues: Issue[] = [];
    const lines = text.split('\n');

    // Bias detection with retext-equality
    const processor = unified().use(retext).use(retextEquality);
    const file = processor.processSync(text);

    file.messages.forEach(message => {
      foundIssues.push({
        type: 'warning',
        message: message.reason,
        line: message.line || 1,
        column: message.column || 1,
        guideline: 'NPOV',
        suggestion: `Consider using a more neutral term than "${message.actual}"`
      });
    });

    // Section length analysis
    const sections: { title: string, startLine: number, content: string }[] = [];
    let currentSection: { title: string, startLine: number, content: string } | null = null;

    lines.forEach((line, index) => {
      const match = line.match(/^==\s*(.*?)\s*==$/);
      if (match) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: match[1],
          startLine: index + 1,
          content: ''
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    });
    if (currentSection) {
      sections.push(currentSection);
    }

    sections.forEach(section => {
      const wordCount = section.content.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > 0 && wordCount < 50) {
        foundIssues.push({
          type: 'info',
          message: `Section "${section.title}" is very short.`,
          line: section.startLine,
          guideline: 'WP:SUMMARY',
          suggestion: 'Consider expanding this section with more details.'
        });
      }
    });

    // Check for standard sections
    const hasReferences = /==\s*References\s*==/i.test(text);
    if (!hasReferences) {
      foundIssues.push({
        type: 'warning',
        message: 'Missing "References" section.',
        line: lines.length,
        guideline: 'WP:LAYOUT',
        suggestion: 'Add a "== References ==" section with <references /> to display citations.'
      });
    }

    const hasSeeAlso = /==\s*See also\s*==/i.test(text);
    if (text.length > 500 && !hasSeeAlso) { // Only suggest for longer articles
      foundIssues.push({
        type: 'info',
        message: 'Consider adding a "See also" section.',
        line: lines.length,
        guideline: 'WP:LAYOUT',
        suggestion: 'A "See also" section can link to other relevant Wikipedia articles.'
      });
    }

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Issues & Suggestions ({issues.length})
            </h3>
            <button
              onClick={getAISuggestions}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              Get AI Suggestions ✨
            </button>
          </div>
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
                      Line {issue.line}{issue.column ? `:${issue.column}` : ''}
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

      {/* AI Suggestions Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                🤖 AI Suggestions
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                &times;
              </button>
            </div>
            {isLoadingAI ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-slate-600 dark:text-slate-300">
                  Analyzing your article...
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <li key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
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
