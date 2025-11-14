# WikiIndaba Hackathon 2025 - Project Documentation

## 🌍 Project: WikiIndaba Quality Analyzer

**Hackathon Dates:** November 21-23, 2025  
**Event:** WikiIndaba Hackathon 2025  
**Organizer:** Wiki Mentor Africa  
**Languages:** English, French, Arabic (+ African languages)

---

## 📋 Project Overview

The WikiIndaba Quality Analyzer is a comprehensive tool designed to analyze Wikipedia and Wikimedia articles with a special focus on African languages, cultures, and knowledge representation. This tool supports the WikiIndaba Hackathon 2025 goals of improving African content representation across the Wikimedia ecosystem.

### 🎯 Alignment with WikiIndaba Goals

1. **Improve African Language Representation**
   - Multi-language support (English, French, Arabic, Swahili, Hausa, Yoruba, Amharic, Zulu)
   - Track usage of African languages in articles
   - Identify gaps in language coverage

2. **Bridge Francophone-Anglophone Gap**
   - Side-by-side comparison of French and English articles
   - Identify content gaps between language versions
   - Facilitate translation and localization efforts

3. **Promote African Sources and Perspectives**
   - Special metrics for African source representation
   - Track citations from African institutions
   - Assess cultural context and sensitivity

4. **Build Community Tools**
   - Batch analysis for multiple articles
   - Export capabilities for sharing results
   - Collaboration-ready features

---

## 🌟 Key Features

### 1. Multi-language Analysis
- **Supported Languages:** English, French, Arabic, Swahili, Hausa, Yoruba, Amharic, Zulu
- **Language Detection:** Automatic detection from Wikipedia URLs
- **Cross-language Comparison:** Compare same topic across different languages

### 2. African Content Metrics (NEW!)
- **African Sources Percentage:** Track citations from African domains and institutions
- **Topic Relevance:** Assess how relevant content is to African topics
- **Local Language References:** Count references to African languages
- **Cultural Context Score:** Evaluate cultural awareness and sensitivity

### 3. Enhanced Quality Analysis
- **Readability Metrics:** Flesch Score, Gunning Fog Index, SMOG Index, Coleman-Liau Index
- **Citation Quality:** Inline citations, citation density, named references
- **Reference Assessment:** Source reliability, diversity, and recency
- **Structural Analysis:** Section organization, navigation elements, content balance

### 4. Visual Analytics
- **Radar Chart:** Spider graph showing quality breakdown across all metrics
- **Reading Time:** Estimated reading time based on language
- **Complexity Level:** Beginner, Intermediate, Advanced, or Expert
- **Progress Bars:** Color-coded visual indicators for all scores

### 5. Batch Analysis
- Analyze multiple articles simultaneously
- Compare articles across topics
- Export results in PDF, CSV, or JSON format

### 6. Collaboration Features
- Share analysis results
- Track recent analyses
- Export for team discussions

---

## 🚀 Technical Implementation

### Architecture
```
Frontend: React 18 + TypeScript
Styling: Tailwind CSS
Charts: Recharts
Build Tool: Vite
APIs: Wikipedia REST API + Action API
```

### New Services Added for WikiIndaba

1. **AfricanContentAnalyzer** (`src/services/africanContentAnalyzer.ts`)
   - Analyzes African source representation
   - Assesses cultural context
   - Generates Africa-specific recommendations

2. **MultilingualWikipediaService** (`src/services/multilingualWikipediaApi.ts`)
   - Handles multi-language API calls
   - Cross-language article comparison
   - Language link extraction

### New Components

1. **LanguageSelector** - Switch between Wikipedia language editions
2. **AfricanContentCard** - Display African content metrics
3. **QualityRadarChart** - Visual quality breakdown
4. **ReadingTimeCard** - Reading time and complexity information

---

## 📊 Metrics Tracked

### Standard Quality Metrics
- Overall Quality Score (0-100)
- Readability Score
- Citation Score
- Reference Score
- Structure Score

### African Content Metrics (WikiIndaba Special)
- African Sources Count
- African Sources Percentage
- African Topic Relevance (0-100)
- Local Language References Count
- Cultural Context Score (0-100)

---

## 🎓 Use Cases for WikiIndaba Community

### 1. Content Gap Analysis
Identify which African topics need more coverage in different languages:
```
Example: Compare "Nelson Mandela" article across EN, FR, AR, SW
- Identify missing sections
- Compare source quality
- Assess cultural representation
```

### 2. Source Diversity Assessment
Ensure articles include African perspectives:
```
- Track percentage of African sources
- Identify over-reliance on Western sources
- Recommend African institutions to cite
```

### 3. Language Equity Monitoring
Track quality differences between language editions:
```
- Compare FR vs EN article quality
- Identify translation needs
- Prioritize improvement efforts
```

### 4. Community Editing Priorities
Help editors focus on high-impact improvements:
```
- Batch analyze category of articles
- Identify common weaknesses
- Generate improvement roadmap
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/wikiindaba-quality-analyzer.git
cd wikiindaba-quality-analyzer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment
No API keys required - uses public Wikipedia APIs

---

## 📱 Usage Guide

### Analyzing an Article

1. **Select Language**
   - Choose from English, French, Arabic, or African languages
   - Language selector in top navigation

2. **Enter Article**
   - Type article title for autocomplete
   - Or paste Wikipedia URL (any language)

3. **View Results**
   - Overall quality score
   - Detailed metric breakdown
   - African content analysis
   - Radar chart visualization
   - Reading time and complexity

4. **Export Results**
   - PDF for presentations
   - CSV for data analysis
   - JSON for programmatic use

### Batch Analysis

1. Click "Batch Analysis" button
2. Enter multiple article titles (one per line)
3. Select language
4. Click "Analyze All"
5. View comparative results
6. Export combined report

---

## 🤝 Contributing to WikiIndaba Hackathon

### How to Participate

1. **Fork the Repository**
   ```bash
   git fork https://github.com/your-username/wikiindaba-quality-analyzer.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow TypeScript best practices
   - Add tests if applicable
   - Update documentation

4. **Submit Pull Request**
   - Clear description of changes
   - Link to WikiIndaba Hackathon project
   - Tag with #WikiIndabaHack2025

### Priority Features for Hackathon

- [ ] Add more African language support
- [ ] Improve African source detection
- [ ] Add Wikidata integration
- [ ] Create mobile app version
- [ ] Add offline capability
- [ ] Implement real-time collaboration
- [ ] Add translation suggestions
- [ ] Create browser extension

---

## 📞 Contact & Support

### WikiIndaba Hackathon Channels
- **Telegram:** WikiIndaba Hackathon Group
- **Support:** Wiki Mentor Africa Telegram
- **Social Media:** #WikiIndabaHack2025
- **Email:** [Your contact email]

### Project Links
- **GitHub:** [Repository URL]
- **Phabricator:** [Phabricator Task Link]
- **Demo:** [Live Demo URL]
- **Documentation:** [Wiki Page]

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Acknowledgments

- **WikiIndaba Conference** - For organizing this amazing hackathon
- **Wiki Mentor Africa** - For supporting African Wikimedia communities
- **Wikimedia Foundation** - For providing APIs and infrastructure
- **African Wikimedia Communities** - For inspiration and feedback

---

## 🎯 Hackathon Submission Checklist

- [x] Project aligns with WikiIndaba goals
- [x] Multi-language support (EN, FR, AR)
- [x] African content metrics implemented
- [x] Documentation complete
- [x] Code is open source
- [x] Demo ready
- [ ] Phabricator task created
- [ ] Presentation prepared
- [ ] Video demo recorded

---

**Built with ❤️ for African Wikimedia Communities**

**WikiIndaba Hackathon 2025 | November 21-23, 2025**
