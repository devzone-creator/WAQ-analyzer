import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { TrainingCanvas } from './components/TrainingCanvas';
import { DualCanvasDisplay } from './components/DualCanvasDisplay';
import { TrainingAnalyzer } from './services/trainingAnalyzer';
import { SupportedLanguage } from './types/wikiindaba';
import { AnalysisMode, CorrectionItem } from './types/training';
import { getTranslation } from './i18n/translations';

function App() {
  const [corrections, setCorrections] = useState<CorrectionItem[]>([]);
  const [originalText, setOriginalText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  
  const t = getTranslation(selectedLanguage);

  const handleAnalyze = async (text: string, language: SupportedLanguage, mode: AnalysisMode) => {
    setIsAnalyzing(true);
    setOriginalText(text);
    setSelectedLanguage(language);

    try {
      if (mode.type === 'article-study' && text.includes('wikipedia.org')) {
        // For now, just analyze the pasted text instead of fetching from Wikipedia
        // Wikipedia API has CORS restrictions
        alert('Article Study Mode: Please paste the article text directly instead of the URL for now.');
        const analysisResults = TrainingAnalyzer.analyzeForTraining(text, language);
        setCorrections(analysisResults);
      } else {
        // Analyze pasted text
        const analysisResults = TrainingAnalyzer.analyzeForTraining(text, language);
        setCorrections(analysisResults);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze. Please check your input and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
            <div className="p-2 md:p-3 bg-white rounded-lg shadow-md border-2 border-gray-300">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-gray-700" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              {t.appTitle}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-2 font-medium px-4">
            {t.appSubtitle}
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <TrainingCanvas 
            onAnalyze={handleAnalyze} 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          
          {isAnalyzing && (
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t.analyzing}</p>
            </div>
          )}
          
          {!isAnalyzing && corrections.length > 0 && (
            <DualCanvasDisplay
              originalText={originalText}
              corrections={corrections}
              language={selectedLanguage}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 md:mt-16 text-center text-gray-600 pb-6 md:pb-8 px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-700">{t.poweredBy}</span>
            <span className="text-xs md:text-sm font-bold text-gray-900">Wikipedia</span>
          </div>
          <p className="text-xs text-gray-500">
            AtiQr • {t.footer}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
