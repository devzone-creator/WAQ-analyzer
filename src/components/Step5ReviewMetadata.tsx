import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Info, ChevronDown } from 'lucide-react';
import { ReviewAndMetadataData } from '../types/waca';

interface Step5ReviewMetadataProps {
  data: ReviewAndMetadataData;
  onUpdate: (data: ReviewAndMetadataData) => void;
  onNext: () => void;
  isLoading: boolean;
}

interface PolicyCheckItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const POLICY_CHECKLIST: PolicyCheckItem[] = [
  {
    id: 'notability',
    label: 'Notability (GNG)',
    description: 'Article has 3+ independent reliable sources proving notability',
    required: true
  },
  {
    id: 'npov',
    label: 'Neutral Point of View (NPOV)',
    description: 'Content is written from neutral perspective without bias',
    required: true
  },
  {
    id: 'verifiability',
    label: 'Verifiability',
    description: 'All factual claims are properly cited with reliable sources',
    required: true
  },
  {
    id: 'no-coi',
    label: 'No Conflict of Interest',
    description: 'Not written to promote or advertise the subject',
    required: true
  },
  {
    id: 'notadvt',
    label: 'Not Advertising or Promotion (WP:NOTADVERT)',
    description: 'Content does not violate Wikipedia\'s advertising policy',
    required: true
  },
  {
    id: 'standards',
    label: 'Wikipedia Style Standards',
    description: 'Follows Wikipedia formatting and style conventions',
    required: true
  }
];

const SUGGESTED_CATEGORIES = [
  'People',
  'Science',
  'Technology',
  'Arts and Culture',
  'History',
  'Sports',
  'Medicine',
  'Business',
  'Politics',
  'Geography',
  'Organizations',
  'Events',
  'Education',
  'Entertainment'
];

export const Step5ReviewMetadata: React.FC<Step5ReviewMetadataProps> = ({
  data,
  onUpdate,
  onNext,
  isLoading
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('checklist');
  const [coiComment, setCoiComment] = useState(data.conflictOfInterestDeclaration || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(data.categories || []);

  const handleChecklistToggle = (itemId: string) => {
    const currentItems = data.policyChecklist || {};
    const newChecklist = {
      ...currentItems,
      [itemId]: !currentItems[itemId]
    };

    onUpdate({
      ...data,
      policyChecklist: newChecklist
    });
  };

  const handleCoiUpdate = (text: string) => {
    setCoiComment(text);
    onUpdate({
      ...data,
      conflictOfInterestDeclaration: text
    });
  };

  const handleCategoryToggle = (category: string) => {
    let newCategories: string[];
    if (selectedCategories.includes(category)) {
      newCategories = selectedCategories.filter(c => c !== category);
    } else {
      newCategories = [...selectedCategories, category];
    }
    setSelectedCategories(newCategories);
    onUpdate({
      ...data,
      categories: newCategories
    });
  };

  const checklistCompletion = Object.entries(data.policyChecklist || {}).filter(([, checked]) => checked).length;
  const isChecklistValid = checklistCompletion === POLICY_CHECKLIST.length;

  return (
    <div className="w-full max-w-4xl">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 mb-2">Review & Metadata</p>
          <p className="text-sm text-blue-800">
            Verify your article meets Wikipedia's core policies. Declare any conflicts of interest and assign categories.
            All items in the policy checklist must be completed before submission.
          </p>
        </div>
      </div>

      {/* Policy Checklist */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <div
          onClick={() => setExpandedSection(expandedSection === 'checklist' ? null : 'checklist')}
          className="flex items-center justify-between cursor-pointer mb-4"
        >
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">Policy Compliance Checklist</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isChecklistValid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {checklistCompletion}/{POLICY_CHECKLIST.length}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 transition ${expandedSection === 'checklist' ? 'rotate-180' : ''}`} />
        </div>

        {expandedSection === 'checklist' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Review each item and confirm your article meets all requirements. You can add explanatory notes for each.
            </p>

            {POLICY_CHECKLIST.map((item) => {
              const isChecked = data.policyChecklist?.[item.id] || false;
              return (
                <div key={item.id} className={`p-4 rounded-lg border-2 transition ${
                  isChecked ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start gap-3 mb-2">
                    <button
                      onClick={() => handleChecklistToggle(item.id)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 transition flex items-center justify-center ${
                        isChecked
                          ? 'bg-green-600 border-green-600'
                          : 'bg-white border-gray-400 hover:border-green-600'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`font-semibold ${isChecked ? 'text-green-900' : 'text-gray-900'}`}>
                        {item.label}
                        {item.required && <span className="text-red-600 ml-1">*</span>}
                      </p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Conflict of Interest Declaration */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <div
          onClick={() => setExpandedSection(expandedSection === 'coi' ? null : 'coi')}
          className="flex items-center justify-between cursor-pointer mb-4"
        >
          <h3 className="font-semibold text-lg">Conflict of Interest Declaration</h3>
          <ChevronDown className={`w-5 h-5 transition ${expandedSection === 'coi' ? 'rotate-180' : ''}`} />
        </div>

        {expandedSection === 'coi' && (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                If you are the subject of the article or have financial/professional interest in the topic, please declare it here.
                This helps Wikipedia maintain transparency and trust.
              </p>
            </div>

            <textarea
              value={coiComment}
              onChange={(e) => handleCoiUpdate(e.target.value)}
              placeholder="Example: 'I am the founder/employee of X' or 'I have no conflict of interest'"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />

            <p className="text-xs text-gray-500 mt-2">
              Disclosure examples: ✓ "I am the CEO of Company X" ✓ "No conflict" ✗ "This is completely unbiased"
            </p>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6">
        <div
          onClick={() => setExpandedSection(expandedSection === 'categories' ? null : 'categories')}
          className="flex items-center justify-between cursor-pointer mb-4"
        >
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">Article Categories</h3>
            <span className="text-sm text-gray-600">({selectedCategories.length} selected)</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition ${expandedSection === 'categories' ? 'rotate-180' : ''}`} />
        </div>

        {expandedSection === 'categories' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Select relevant categories to help readers find your article. Categories help organize Wikipedia's content.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {SUGGESTED_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-100 text-blue-900 border-blue-400'
                      : 'bg-white text-gray-900 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {selectedCategories.includes(category) ? '✓ ' : '+ '}{category}
                </button>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">Selected Categories ({selectedCategories.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <div
                      key={category}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2"
                    >
                      {category}
                      <button
                        onClick={() => handleCategoryToggle(category)}
                        className="hover:opacity-75"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCategories.length === 0 && (
              <p className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
                No categories selected. Select at least 1-2 categories.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Summary & Validation */}
      <div className={`rounded-lg p-6 border-2 mb-6 ${
        isChecklistValid && selectedCategories.length > 0
          ? 'bg-green-50 border-green-300'
          : 'bg-yellow-50 border-yellow-300'
      }`}>
        <div className="flex gap-3 items-start mb-3">
          {isChecklistValid && selectedCategories.length > 0 ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-semibold text-lg ${
              isChecklistValid && selectedCategories.length > 0 ? 'text-green-900' : 'text-yellow-900'
            }`}>
              {isChecklistValid && selectedCategories.length > 0 ? '✓ Ready for Review' : '⚠ Incomplete'}
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li className={isChecklistValid ? 'text-green-800' : 'text-yellow-800'}>
                {isChecklistValid ? '✓' : '✗'} Policy compliance: {checklistCompletion}/{POLICY_CHECKLIST.length} items
              </li>
              <li className={selectedCategories.length > 0 ? 'text-green-800' : 'text-yellow-800'}>
                {selectedCategories.length > 0 ? '✓' : '✗'} Categories: {selectedCategories.length} selected
              </li>
              <li className="text-gray-700">
                ℹ Conflict of Interest: {coiComment ? 'Declared' : 'Not declared (optional)'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          disabled={!isChecklistValid || selectedCategories.length === 0 || isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {isLoading ? 'Processing...' : 'Review Complete ✓ - Final Step'}
        </button>
      </div>
    </div>
  );
};
