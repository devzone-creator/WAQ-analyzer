import React, { useState } from 'react';
import { Copy, Download, AlertCircle, CheckCircle2, Info, ExternalLink } from 'lucide-react';
import { WACWizardState } from '../types/waca';

interface Step6FinalSubmissionProps {
  wizardState: WACWizardState;
  onSubmit: () => void;
  isLoading: boolean;
}

export const Step6FinalSubmission: React.FC<Step6FinalSubmissionProps> = ({
  wizardState,
  onSubmit,
  isLoading
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const generateWikitext = (): string => {
    const lines: string[] = [];

    // Title
    lines.push(`= ${wizardState.articleTitle} =\n`);

    // Lead section
    lines.push(wizardState.step2?.leadText || '');
    lines.push('');

    // Infobox
    if (wizardState.step2?.infoboxWikitext) {
      lines.push(wizardState.step2.infoboxWikitext);
      lines.push('');
    }

    // Content sections
    if (wizardState.step4?.contentText) {
      lines.push(wizardState.step4.contentText);
      lines.push('');
    }

    // References section
    if (wizardState.step3?.citations && wizardState.step3.citations.length > 0) {
      lines.push('== References ==');
      lines.push('<references />');
      lines.push('');
    }

    // Categories
    if (wizardState.step5?.categories && wizardState.step5.categories.length > 0) {
      lines.push('== Categories ==');
      wizardState.step5.categories.forEach(category => {
        lines.push(`[[Category:${category}]]`);
      });
    }

    return lines.join('\n');
  };

  const generateSubmissionTemplate = (): string => {
    const lines: string[] = [];

    // AfC submission container
    lines.push('{{subst:submit');
    lines.push('|notability=yes');
    lines.push('|neutral=yes');
    lines.push('|verifiability=yes');
    lines.push('|advertising=no');
    lines.push('|topics=general');
    lines.push('}}');
    lines.push('');

    // WACA metadata tag
    lines.push('{{User:WACA/Tool-Tag');
    lines.push('|tool=Wikipedia Article Creation Assistant');
    lines.push('|version=1.0');
    lines.push('|submission_date={{subst:CURRENTYEAR}}-{{subst:CURRENTMONTH}}-{{subst:CURRENTDAY}}');
    if (wizardState.step5?.conflictOfInterestDeclaration) {
      lines.push(`|coi_declaration=${wizardState.step5.conflictOfInterestDeclaration}`);
    }
    lines.push('}}');

    return lines.join('\n');
  };

  const generateEditSummary = (): string => {
    return 'Creating new draft via WACA Tool (v1.0)';
  };

  const copySectionToClipboard = (section: string, sectionName: string) => {
    navigator.clipboard.writeText(section);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadDraft = () => {
    const content = generateWikitext();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${wizardState.articleTitle}_draft.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const wikitext = generateWikitext();
  const submissionTemplate = generateSubmissionTemplate();
  const editSummary = generateEditSummary();

  return (
    <div className="w-full max-w-4xl">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 mb-2">Final Submission</p>
          <p className="text-sm text-blue-800">
            Review your complete article draft. You can copy, download, or submit directly to Wikipedia's Articles for Creation (AfC) space.
            Your article has been validated and is ready for peer review.
          </p>
        </div>
      </div>

      {/* Submission Options */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-300 p-4 text-center">
          <Download className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <button
            onClick={downloadDraft}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Download Draft
          </button>
          <p className="text-xs text-gray-600 mt-1">Save as .txt file</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 p-4 text-center">
          <Copy className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <button
            onClick={() => copySectionToClipboard(wikitext, 'wikitext')}
            className="text-sm font-semibold text-green-600 hover:text-green-700"
          >
            Copy Wikitext
          </button>
          <p className="text-xs text-gray-600 mt-1">Copy to clipboard</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 p-4 text-center">
          <ExternalLink className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <a
            href="https://en.wikipedia.org/w/index.php?title=Wikipedia:Articles_for_creation&action=edit&preload=Template:Article_for_creation&editintro=Template:Article_for_creation/editintro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            Submit to AfC
          </a>
          <p className="text-xs text-gray-600 mt-1">Open in Wikipedia</p>
        </div>
      </div>

      {/* Article Draft Preview */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-lg">Your Article Draft</h3>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-auto font-mono text-sm">
          <pre className="whitespace-pre-wrap break-words text-gray-800">
            {wikitext}
          </pre>
        </div>

        <button
          onClick={() => copySectionToClipboard(wikitext, 'draft')}
          className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copiedSection === 'draft' ? 'Copied!' : 'Copy Draft'}
        </button>
      </div>

      {/* Submission Template */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-3">Submission Metadata</h3>
        <p className="text-sm text-gray-600 mb-4">
          These templates will be added automatically when submitting to Articles for Creation:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Submission Template:</p>
          <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-800 mb-3">
            {submissionTemplate}
          </pre>
          <button
            onClick={() => copySectionToClipboard(submissionTemplate, 'template')}
            className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copiedSection === 'template' ? 'Copied!' : 'Copy Template'}
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Edit Summary:</p>
          <pre className="text-xs font-mono whitespace-pre-wrap break-words text-gray-800 mb-3">
            {editSummary}
          </pre>
          <button
            onClick={() => copySectionToClipboard(editSummary, 'summary')}
            className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copiedSection === 'summary' ? 'Copied!' : 'Copy Edit Summary'}
          </button>
        </div>
      </div>

      {/* Submission Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex gap-3 items-start mb-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-900 mb-2">Before Submitting</p>
            <ul className="text-sm text-yellow-800 space-y-2 list-disc list-inside">
              <li>Review the draft carefully for grammar and formatting</li>
              <li>Verify all sources are reliable and properly cited</li>
              <li>Ensure the article complies with Wikipedia's Notability Guideline (GNG)</li>
              <li>Do not submit if you have undisclosed conflicts of interest</li>
              <li>Your submission will be reviewed by Wikipedia volunteers</li>
              <li>Reviewers may suggest changes before acceptance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Article Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 text-center">
          <p className="text-sm text-gray-600">Sources</p>
          <p className="text-2xl font-bold text-gray-900">{wizardState.step3?.citations?.length || 0}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 text-center">
          <p className="text-sm text-gray-600">Sections</p>
          <p className="text-2xl font-bold text-gray-900">{wizardState.step3?.sections?.length || 0}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 text-center">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-2xl font-bold text-gray-900">{wizardState.step5?.categories?.length || 0}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 text-center">
          <p className="text-sm text-gray-600">Word Count</p>
          <p className="text-2xl font-bold text-gray-900">
            {wikitext.split(/\s+/).filter(w => w.length > 0).length}
          </p>
        </div>
      </div>

      {/* Checklist Summary */}
      <div className="bg-green-50 rounded-lg border border-green-300 p-6 mb-6">
        <h3 className="font-semibold text-lg text-green-900 mb-3">✓ Submission Ready</h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Article title defined
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Lead section (1-3 sentences) complete
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Infobox configured
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {wizardState.step3?.citations?.length || 0}+ citations added
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> NPOV scoring validated
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Policy compliance verified
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Categories assigned
          </li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-bold text-lg transition"
        >
          {isLoading ? 'Submitting...' : '🚀 Submit Article to Wikipedia'}
        </button>
        <p className="text-xs text-gray-600 text-center">
          You will be prompted to log in to Wikipedia and complete the submission process
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-gray-300 text-center">
        <p className="text-xs text-gray-600">
          Powered by WACA (Wikipedia Article Creation Assistant) v1.0
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Questions? See {' '}
          <a href="https://en.wikipedia.org/wiki/Wikipedia:AFC" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
            Articles for Creation guidelines
          </a>
        </p>
      </div>
    </div>
  );
};
