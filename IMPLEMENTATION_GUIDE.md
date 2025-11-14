# WikiIndaba Quality Analyzer - Implementation Guide

## 🎯 Quick Implementation Roadmap

This guide helps you implement the WikiIndaba-specific features step by step.

---

## Phase 1: Core Multi-language Support (2-3 hours)

### Step 1: Update Article Input Component

Add language selector to `ArticleInput.tsx`:

```typescript
import { LanguageSelector } from './LanguageSelector';
import { SupportedLanguage } from '../types/wikiindaba';

// Add state
const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');

// Add to JSX before search input
<LanguageSelector 
  selectedLanguage={selectedLanguage}
  onLanguageChange={setSelectedLanguage}
/>
```

### Step 2: Update App.tsx to Use Multilingual API

```typescript
import { MultilingualWikipediaService } from './services/multilingualWikipediaApi';
import { AfricanContentAnalyzer } from './services/africanContentAnalyzer';

// In handleAnalyze function:
const articleData = await MultilingualWikipediaService.getArticleContent(title, selectedLanguage);

// Add African metrics
const africanMetrics = AfricanContentAnalyzer.analyzeAfricanContent(
  articleData.content,
  articleData.extlinks
);

// Add to analysis result
const analysis: AnalysisResult = {
  article,
  scores,
  suggestions: enhancedSuggestions.map(s => s.suggestion),
  timestamp: new Date().toISOString(),
  language: selectedLanguage,
  africanMetrics,
  readingTime: MultilingualWikipediaService.estimateReadingTime(article.extract, selectedLanguage),
  complexityLevel: MultilingualWikipediaService.getComplexityLevel(scores.readability.fleschScore),
  wordCount: article.extract.split(/\s+/).length
};
```

---

## Phase 2: African Content Metrics (1-2 hours)

### Step 1: Add African Content Card to Results

Update `EnhancedAnalysisResults.tsx`:

```typescript
import { AfricanContentCard } from './AfricanContentCard';
import { AfricanContentAnalyzer } from '../services/africanContentAnalyzer';

// In component:
const africanRecommendations = analysis.africanMetrics 
  ? AfricanContentAnalyzer.generateAfricanContentRecommendations(analysis.africanMetrics)
  : [];

// Add to JSX:
{analysis.africanMetrics && (
  <AfricanContentCard 
    metrics={analysis.africanMetrics}
    recommendations={africanRecommendations}
  />
)}
```

---

## Phase 3: Visual Enhancements (2-3 hours)

### Step 1: Add Radar Chart

Update `EnhancedAnalysisResults.tsx`:

```typescript
import { QualityRadarChart } from './RadarChart';

// Add to JSX:
<QualityRadarChart scores={analysis.scores} />
```

### Step 2: Add Reading Time Card

```typescript
import { ReadingTimeCard } from './ReadingTimeCard';

// Add to JSX:
{analysis.readingTime && analysis.complexityLevel && (
  <ReadingTimeCard
    readingTime={analysis.readingTime}
    complexityLevel={analysis.complexityLevel}
    wordCount={analysis.wordCount || 0}
  />
)}
```

---

## Phase 4: Cross-Language Comparison (3-4 hours)

### Step 1: Create Comparison Component

Create `src/components/CrossLanguageComparison.tsx`:

```typescript
import React, { useState } from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types/wikiindaba';
import { MultilingualWikipediaService } from '../services/multilingualWikipediaApi';

interface CrossLanguageComparisonProps {
  articleTitle: string;
  sourceLanguage: SupportedLanguage;
  onCompare: (results: any[]) => void;
}

export function CrossLanguageComparison({ 
  articleTitle, 
  sourceLanguage, 
  onCompare 
}: CrossLanguageComparisonProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<SupportedLanguage[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      const results = await MultilingualWikipediaService.compareAcrossLanguages(
        articleTitle,
        sourceLanguage,
        selectedLanguages
      );
      onCompare(results);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Compare Across Languages
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.filter(l => l.code !== sourceLanguage).map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLanguages(prev =>
                  prev.includes(lang.code)
                    ? prev.filter(l => l !== lang.code)
                    : [...prev, lang.code]
                );
              }}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                selectedLanguages.includes(lang.code)
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>

        <button
          onClick={handleCompare}
          disabled={selectedLanguages.length === 0 || isComparing}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          {isComparing ? 'Comparing...' : `Compare with ${selectedLanguages.length} language(s)`}
        </button>
      </div>
    </div>
  );
}
```

---

## Phase 5: Export & Sharing (2-3 hours)

### Step 1: Enhance Export Service

Update `src/services/exportService.ts` to include African metrics:

```typescript
// Add to PDF export
if (analysis.africanMetrics) {
  doc.text('African Content Metrics:', 20, yPos);
  yPos += 10;
  doc.text(`African Sources: ${analysis.africanMetrics.africanSourcesPercentage}%`, 30, yPos);
  yPos += 7;
  doc.text(`Topic Relevance: ${analysis.africanMetrics.africanTopicRelevance}`, 30, yPos);
  yPos += 7;
  doc.text(`Cultural Context: ${analysis.africanMetrics.culturalContextScore}`, 30, yPos);
  yPos += 10;
}

// Add to CSV export
const africanMetricsRow = analysis.africanMetrics 
  ? `\nAfrican Sources,${analysis.africanMetrics.africanSourcesPercentage}%
Topic Relevance,${analysis.africanMetrics.africanTopicRelevance}
Cultural Context,${analysis.africanMetrics.culturalContextScore}`
  : '';
```

---

## Phase 6: UI/UX Polish (2-3 hours)

### Step 1: Add WikiIndaba Branding

Update header in `App.tsx`:

```typescript
<div className="flex items-center space-x-2 lg:space-x-3">
  <div className="p-1.5 lg:p-2 bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-lg lg:rounded-xl shadow-lg">
    <Globe2 className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
  </div>
  <div>
    <h1 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">
      WikiIndaba Quality Analyzer
    </h1>
    <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300">
      Hackathon 2025 | Supporting African Wikimedia
    </p>
  </div>
</div>
```

### Step 2: Add Language Badges

Show current language prominently:

```typescript
<div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
  <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
    {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName}
  </span>
</div>
```

---

## Phase 7: Testing & Optimization (2-3 hours)

### Test Cases

1. **Multi-language Search**
   - Test: Search "Nelson Mandela" in EN, FR, AR
   - Expected: Returns correct articles in each language

2. **African Content Detection**
   - Test: Analyze "Lagos" article
   - Expected: High African relevance score

3. **Cross-language Comparison**
   - Test: Compare "African Union" across EN, FR, AR
   - Expected: Shows quality differences

4. **Export Functionality**
   - Test: Export analysis with African metrics
   - Expected: PDF/CSV includes all metrics

### Performance Optimization

```typescript
// Add caching for language links
const langLinksCache = new Map<string, any>();

// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query: string, lang: SupportedLanguage) => {
    MultilingualWikipediaService.searchArticles(query, lang);
  }, 300),
  []
);
```

---

## Phase 8: Documentation & Deployment (1-2 hours)

### Step 1: Update README

Add WikiIndaba-specific sections:
- Multi-language support
- African content metrics
- Hackathon participation info

### Step 2: Create Demo Video

Record 2-3 minute demo showing:
1. Language selection
2. Article analysis
3. African metrics
4. Cross-language comparison
5. Export functionality

### Step 3: Deploy

```bash
# Build for production
npm run build

# Deploy to Toolforge, Netlify, or Vercel
# Follow DEPLOYMENT.md instructions
```

---

## 🎯 Priority Order for Hackathon

If time is limited, implement in this order:

1. **Must Have** (Day 1)
   - Multi-language support
   - African content metrics
   - Basic UI updates

2. **Should Have** (Day 2)
   - Radar chart visualization
   - Reading time/complexity
   - Export with African metrics

3. **Nice to Have** (Day 3)
   - Cross-language comparison
   - Advanced visualizations
   - Collaboration features

---

## 🐛 Common Issues & Solutions

### Issue: Language selector not working
**Solution:** Ensure `selectedLanguage` state is passed to API calls

### Issue: African metrics showing 0
**Solution:** Check that `externalLinks` array is populated from API

### Issue: Radar chart not rendering
**Solution:** Verify recharts is installed: `npm install recharts`

### Issue: RTL languages (Arabic) display incorrectly
**Solution:** Add `dir="rtl"` to container when language is Arabic

---

## 📚 Additional Resources

- [Wikipedia API Documentation](https://www.mediawiki.org/wiki/API:Main_page)
- [WikiIndaba Hackathon Page](https://meta.wikimedia.org/wiki/WikiIndaba)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Ready to build? Start with Phase 1 and work your way through!**

**Questions? Reach out on WikiIndaba Hackathon Telegram!**
