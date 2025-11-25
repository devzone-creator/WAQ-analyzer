import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { LeadAndInfoboxData } from '../types/waca';

interface Step2LeadInfoboxProps {
  data: LeadAndInfoboxData;
  onUpdate: (data: LeadAndInfoboxData) => void;
  onNext: () => void;
  isLoading: boolean;
}

const INFOBOX_TYPES = [
  { id: 'person', label: 'Person', fields: ['Name', 'Birth Date', 'Birth Place', 'Nationality', 'Occupation'] },
  { id: 'organization', label: 'Organization', fields: ['Name', 'Founded', 'Founder', 'Headquarters', 'Industry'] },
  { id: 'event', label: 'Event', fields: ['Name', 'Date', 'Location', 'Participants', 'Outcome'] },
  { id: 'place', label: 'Place', fields: ['Name', 'Location', 'Population', 'Area', 'Established'] },
  { id: 'work', label: 'Work/Book', fields: ['Title', 'Author', 'Publication Date', 'Genre', 'Publisher'] }
];

export const Step2LeadInfobox: React.FC<Step2LeadInfoboxProps> = ({
  data,
  onUpdate,
  onNext,
  isLoading
}) => {
  const [selectedInfoboxType, setSelectedInfoboxType] = useState<string>('person');
  const [leadCharCount, setLeadCharCount] = useState(data.leadText.length);

  const handleLeadChange = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    setLeadCharCount(text.length);

    onUpdate({
      ...data,
      leadText: text,
      leadSentences: sentences,
      isValid: text.trim().length > 0 && sentences >= 1 && sentences <= 3
    });
  };

  const handleInfoboxFieldChange = (fieldName: string, value: string) => {
    const updatedFields = { ...data.infoboxFields, [fieldName]: value };
    const wikitext = generateInfoboxWikitext(selectedInfoboxType, updatedFields);

    onUpdate({
      ...data,
      infoboxFields: updatedFields,
      infoboxWikitext: wikitext
    });
  };

  const handleInfoboxTypeChange = (typeId: string) => {
    setSelectedInfoboxType(typeId);
    const defaultFields: Record<string, string> = {};
    const infoboxType = INFOBOX_TYPES.find(t => t.id === typeId);
    
    if (infoboxType) {
      infoboxType.fields.forEach(field => {
        defaultFields[field] = data.infoboxFields[field] || '';
      });
    }

    const wikitext = generateInfoboxWikitext(typeId, defaultFields);

    onUpdate({
      ...data,
      infoboxFields: defaultFields,
      infoboxWikitext: wikitext
    });
  };

  const generateInfoboxWikitext = (typeId: string, fields: Record<string, string>): string => {
    const typeMap: Record<string, string> = {
      person: 'Infobox person',
      organization: 'Infobox organization',
      event: 'Infobox event',
      place: 'Infobox place',
      work: 'Infobox book'
    };

    const wikitextLines: string[] = [`{{${typeMap[typeId]}`];

    Object.entries(fields).forEach(([key, value]) => {
      if (value.trim()) {
        const wikiKey = key.toLowerCase().replace(/\s+/g, '_');
        wikitextLines.push(`| ${wikiKey} = ${value}`);
      }
    });

    wikitextLines.push('}}');
    return wikitextLines.join('\n');
  };

  const currentInfoboxType = INFOBOX_TYPES.find(t => t.id === selectedInfoboxType);
  const isLeadValid = data.leadSentences >= 1 && data.leadSentences <= 3 && data.leadText.trim().length > 0;

  return (
    <div className="w-full max-w-4xl">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 mb-2">Lead Section & Infobox</p>
          <p className="text-sm text-blue-800">
            The lead section is the article's summary (1-3 sentences). The infobox displays key facts at a glance.
            Both are essential for a well-structured Wikipedia article.
          </p>
        </div>
      </div>

      {/* Lead Section */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-3">Lead Section</h3>
        <p className="text-sm text-gray-600 mb-4">
          Write 1-3 sentences that define and summarize your article topic. The first sentence should clearly state the topic's name and category.
        </p>

        <textarea
          value={data.leadText}
          onChange={(e) => handleLeadChange(e.target.value)}
          placeholder="Example: 'Marie Curie was a Polish-born physicist and chemist who conducted pioneering research on radioactivity...'"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={5}
        />

        <div className="mt-3 flex justify-between text-sm">
          <div className="flex gap-4">
            <span className="text-gray-600">
              Sentences: <span className="font-semibold text-gray-900">{data.leadSentences}</span>/3
            </span>
            <span className="text-gray-600">
              Characters: <span className="font-semibold text-gray-900">{leadCharCount}</span>
            </span>
          </div>
          {isLeadValid ? (
            <span className="text-green-600 font-semibold">✓ Valid</span>
          ) : (
            <span className="text-red-600 font-semibold">
              {data.leadSentences === 0 ? 'Write at least 1 sentence' : data.leadSentences > 3 ? 'Maximum 3 sentences' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Infobox Setup */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Infobox Template</h3>

        {/* Type Selection */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-900 mb-3">Select Infobox Type</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {INFOBOX_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleInfoboxTypeChange(type.id)}
                className={`px-4 py-2 rounded-lg border-2 transition font-medium ${
                  selectedInfoboxType === type.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-900 border-gray-300 hover:border-blue-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fields */}
        {currentInfoboxType && (
          <div className="space-y-4 mb-6">
            <p className="text-sm text-gray-600 mb-4">Fill in the fields below (only non-empty fields will appear in the final infobox):</p>
            {currentInfoboxType.fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field}</label>
                <input
                  type="text"
                  value={data.infoboxFields[field] || ''}
                  onChange={(e) => handleInfoboxFieldChange(field, e.target.value)}
                  placeholder={`Enter ${field.toLowerCase()}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        )}

        {/* Wikitext Preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
          <p className="text-sm font-semibold text-gray-900 mb-2">Wikitext Preview</p>
          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-48 font-mono">
            {data.infoboxWikitext || '{{ Infobox template will appear here }}'}
          </pre>
        </div>
      </div>

      {/* Visual Preview */}
      <div className="bg-gray-50 rounded-lg border border-gray-300 p-6 mb-6">
        <p className="font-semibold text-gray-900 mb-4">Article Preview</p>
        <div className="bg-white p-6 rounded border border-gray-200">
          <div className="float-right ml-6 mb-4 border border-gray-300 p-4 bg-gray-50 w-48 rounded">
            <p className="font-bold text-center text-sm">Infobox</p>
            <p className="text-xs text-gray-600 text-center">(Will display summary data)</p>
            {Object.entries(data.infoboxFields).some(([, v]) => v) && (
              <div className="mt-3 text-xs space-y-2">
                {Object.entries(data.infoboxFields).map(([k, v]) => 
                  v ? <div key={k} className="pb-2 border-b border-gray-300"><span className="font-semibold">{k}</span>: {v}</div> : null
                )}
              </div>
            )}
          </div>

          <p className="text-justify">{data.leadText || '(Your lead section will appear here)'}</p>
          <div className="clear-both"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          disabled={!isLeadValid || isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {isLoading ? 'Processing...' : 'Lead & Infobox Complete ✓ - Next Step'}
        </button>
      </div>
    </div>
  );
};
