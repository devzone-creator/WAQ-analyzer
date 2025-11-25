import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, Info } from 'lucide-react';
import { CitationStructureData, Citation } from '../types/waca';

interface Step3CitationStructureProps {
  data: CitationStructureData;
  onUpdate: (data: CitationStructureData) => void;
  onNext: () => void;
  isLoading: boolean;
}

const STANDARD_SECTIONS = [
  { id: 'early-life', label: 'Early Life', required: true },
  { id: 'career', label: 'Career', required: true },
  { id: 'achievements', label: 'Achievements', required: false },
  { id: 'personal-life', label: 'Personal Life', required: false },
  { id: 'legacy', label: 'Legacy', required: false }
];

export const Step3CitationStructure: React.FC<Step3CitationStructureProps> = ({
  data,
  onUpdate,
  onNext,
  isLoading
}) => {
  const [citationForm, setCitationForm] = useState<Partial<Citation>>({});
  const [selectedSection, setSelectedSection] = useState<string>('early-life');

  const handleAddSection = (sectionId: string) => {
    if (!data.sections.includes(sectionId)) {
      onUpdate({
        ...data,
        sections: [...data.sections, sectionId],
        sectionCitations: { ...data.sectionCitations, [sectionId]: [] }
      });
    }
  };

  const handleRemoveSection = (sectionId: string) => {
    const newSections = data.sections.filter(s => s !== sectionId);
    const newCitations = { ...data.sectionCitations };
    delete newCitations[sectionId];

    onUpdate({
      ...data,
      sections: newSections,
      sectionCitations: newCitations
    });
  };

  const handleAddCitation = () => {
    const newCitation: Citation = {
      id: `citation-${Date.now()}`,
      url: citationForm.url || '',
      title: citationForm.title || '',
      author: citationForm.author || '',
      accessDate: citationForm.accessDate || new Date().toISOString().split('T')[0],
      archiveUrl: citationForm.archiveUrl,
      archiveDate: citationForm.archiveDate
    };

    const currentCitations = data.sectionCitations[selectedSection] || [];
    const updatedCitations = [...currentCitations, newCitation];

    onUpdate({
      ...data,
      citations: [...data.citations, newCitation],
      sectionCitations: {
        ...data.sectionCitations,
        [selectedSection]: updatedCitations
      }
    });

    setCitationForm({});
  };

  const handleRemoveCitation = (citationId: string) => {
    const updatedCitations = data.citations.filter(c => c.id !== citationId);
    const updatedSectionCitations = { ...data.sectionCitations };

    Object.keys(updatedSectionCitations).forEach(section => {
      updatedSectionCitations[section] = updatedSectionCitations[section].filter(
        c => c.id !== citationId
      );
    });

    onUpdate({
      ...data,
      citations: updatedCitations,
      sectionCitations: updatedSectionCitations
    });
  };

  const validateStructure = (): boolean => {
    // At least 2 sections required
    if (data.sections.length < 2) return false;

    // Each section must have at least 1 citation
    for (const sectionId of data.sections) {
      const sectionCitations = data.sectionCitations[sectionId] || [];
      if (sectionCitations.length === 0) return false;
    }

    return true;
  };

  const isValid = validateStructure();
  const currentSectionCitations = data.sectionCitations[selectedSection] || [];
  const currentSection = STANDARD_SECTIONS.find(s => s.id === selectedSection);

  return (
    <div className="w-full max-w-4xl">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 mb-2">Citation Structure</p>
          <p className="text-sm text-blue-800">
            Organize your article into sections (Early Life, Career, etc.) and add citations for each section.
            At least 2 sections with at least 1 citation each are required.
          </p>
        </div>
      </div>

      {/* Section Selection */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Article Sections</h3>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Available sections (select to add):</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {STANDARD_SECTIONS.map((section) => {
              const isAdded = data.sections.includes(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => isAdded ? handleRemoveSection(section.id) : handleAddSection(section.id)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                    isAdded
                      ? 'bg-green-100 text-green-900 border-green-400'
                      : 'bg-white text-gray-900 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {isAdded ? '✓ ' : '+ '}{section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Sections */}
        {data.sections.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Your sections ({data.sections.length}):</p>
            <div className="space-y-2">
              {data.sections.map((sectionId) => {
                const section = STANDARD_SECTIONS.find(s => s.id === sectionId);
                const citationCount = (data.sectionCitations[sectionId] || []).length;
                const hasError = citationCount === 0;

                return (
                  <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => setSelectedSection(sectionId)}
                        className={`flex-1 text-left px-3 py-2 rounded ${
                          selectedSection === sectionId
                            ? 'bg-blue-100 text-blue-900 font-semibold'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {section?.label}
                      </button>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        hasError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {citationCount} citation{citationCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSection(sectionId)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Citation Management */}
      {data.sections.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">
            Citations for: <span className="text-blue-600">{currentSection?.label}</span>
          </h3>

          {/* Citation Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-4">Add Citation</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
                <input
                  type="url"
                  value={citationForm.url || ''}
                  onChange={(e) => setCitationForm({ ...citationForm, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={citationForm.title || ''}
                    onChange={(e) => setCitationForm({ ...citationForm, title: e.target.value })}
                    placeholder="Article Title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={citationForm.author || ''}
                    onChange={(e) => setCitationForm({ ...citationForm, author: e.target.value })}
                    placeholder="Author Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Date</label>
                  <input
                    type="date"
                    value={citationForm.accessDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCitationForm({ ...citationForm, accessDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Archive URL (optional)</label>
                  <input
                    type="url"
                    value={citationForm.archiveUrl || ''}
                    onChange={(e) => setCitationForm({ ...citationForm, archiveUrl: e.target.value })}
                    placeholder="Archive link"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleAddCitation}
                disabled={!citationForm.url?.trim() || !citationForm.title?.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Citation
              </button>
            </div>
          </div>

          {/* Citations List */}
          {currentSectionCitations.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">Citations ({currentSectionCitations.length}):</p>
              {currentSectionCitations.map((citation) => (
                <div key={citation.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{citation.title}</p>
                      <p className="text-sm text-blue-600 truncate">{citation.url}</p>
                      {citation.author && <p className="text-sm text-gray-600">Author: {citation.author}</p>}
                      <p className="text-xs text-gray-500 mt-1">Accessed: {citation.accessDate}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveCitation(citation.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Citation Wikitext Preview */}
                  <div className="mt-2 p-2 bg-white rounded border border-gray-300">
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {`<ref>{{cite web|url=${citation.url}|title=${citation.title}${citation.author ? `|author=${citation.author}` : ''}|accessdate=${citation.accessDate}}}</ref>`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentSectionCitations.length === 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">Add at least 1 citation to this section</p>
            </div>
          )}
        </div>
      )}

      {/* Validation Summary */}
      <div className={`rounded-lg p-4 border-2 mb-6 ${
        isValid ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
      }`}>
        <p className={`font-semibold ${isValid ? 'text-green-900' : 'text-red-900'}`}>
          {isValid ? '✓ Citation Structure Valid' : '⚠ Citation Structure Incomplete'}
        </p>
        <ul className="text-sm mt-2 space-y-1">
          <li className={data.sections.length >= 2 ? 'text-green-800' : 'text-red-800'}>
            {data.sections.length >= 2 ? '✓' : '✗'} At least 2 sections ({data.sections.length})
          </li>
          <li className={data.sections.every(s => (data.sectionCitations[s] || []).length > 0) ? 'text-green-800' : 'text-red-800'}>
            {data.sections.every(s => (data.sectionCitations[s] || []).length > 0) ? '✓' : '✗'} Each section has citations
          </li>
          <li className={data.citations.length >= 3 ? 'text-green-800' : 'text-orange-800'}>
            ℹ Total citations: {data.citations.length} (3+ recommended)
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          disabled={!isValid || isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {isLoading ? 'Processing...' : 'Citation Structure Complete ✓ - Next Step'}
        </button>
      </div>
    </div>
  );
};
