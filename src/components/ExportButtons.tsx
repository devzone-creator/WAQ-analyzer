import React from 'react';
import { Download, FileText, FileJson, FileSpreadsheet, Printer } from 'lucide-react';
import { ExportService } from '../services/exportService';
import { CorrectionItem } from '../types/training';

interface ExportButtonsProps {
  originalText: string;
  corrections: CorrectionItem[];
  language: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  originalText,
  corrections,
  language
}) => {
  const handleExport = (format: 'pdf' | 'csv' | 'json' | 'markdown') => {
    switch (format) {
      case 'pdf':
        ExportService.exportToPDF(originalText, corrections, language);
        break;
      case 'csv':
        ExportService.exportToCSV(corrections);
        break;
      case 'json':
        ExportService.exportToJSON(originalText, corrections, language);
        break;
      case 'markdown':
        ExportService.exportToMarkdown(originalText, corrections, language);
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-gray-700" />
            Export Your Analysis
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Save your training session for review or sharing with teachers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => handleExport('pdf')}
          className="flex flex-col items-center gap-2 p-4 border-2 border-gray-300 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition-all group"
        >
          <Printer className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            Print/PDF
          </span>
          <span className="text-xs text-gray-500">Printable report</span>
        </button>

        <button
          onClick={() => handleExport('markdown')}
          className="flex flex-col items-center gap-2 p-4 border-2 border-gray-300 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition-all group"
        >
          <FileText className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            Markdown
          </span>
          <span className="text-xs text-gray-500">For documentation</span>
        </button>

        <button
          onClick={() => handleExport('csv')}
          className="flex flex-col items-center gap-2 p-4 border-2 border-gray-300 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition-all group"
        >
          <FileSpreadsheet className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            CSV
          </span>
          <span className="text-xs text-gray-500">For spreadsheets</span>
        </button>

        <button
          onClick={() => handleExport('json')}
          className="flex flex-col items-center gap-2 p-4 border-2 border-gray-300 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition-all group"
        >
          <FileJson className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            JSON
          </span>
          <span className="text-xs text-gray-500">For developers</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 border-2 border-gray-300 rounded-lg">
        <p className="text-xs text-gray-700">
          💡 <strong>Tip:</strong> Export your analysis to track your progress over time or share with your teacher for feedback!
        </p>
      </div>
    </div>
  );
};
