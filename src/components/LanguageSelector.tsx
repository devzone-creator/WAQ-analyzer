import React from 'react';
import { Globe } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types/wikiindaba';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  className?: string;
}

export function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange,
  className = ''
}: LanguageSelectorProps) {
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        <Globe className="inline h-4 w-4 mr-1" />
        Wikipedia Language
      </label>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white"
        dir={currentLang?.direction || 'ltr'}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Analyze articles from different Wikipedia language editions
      </p>
    </div>
  );
}
