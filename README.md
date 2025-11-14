# Wikipedia Article Editor & Quality Checker

A real-time article quality checker and writing assistant for Wikipedia contributors. Write or paste your article content and get instant feedback based on Wikipedia's guidelines, policies, and best practices. Built for the **WikiIndaba Hackathon 2025** to help African and global contributors create high-quality Wikipedia articles.

**✍️ Write Better Articles | 📋 Real-time Feedback | 🌍 Multilingual Support | 📖 Wikipedia Guidelines Compliant**

![Wikipedia Article Editor](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Wikipedia+Article+Editor)

## 🌟 Features

### Writing & Editing Canvas
- **📝 Live Editor**: Write or paste your article content in a clean, distraction-free editor
- **⚡ Real-time Analysis**: Get instant feedback as you type
- **🎯 Inline Suggestions**: See specific issues highlighted directly in your text
- **📋 Wikipedia Guidelines**: Automatic checks against Wikipedia's core policies and guidelines
- **🔍 Citation Helper**: Identify where citations are needed and get formatting help

### Wikipedia Policy Compliance
- **✅ Neutral Point of View (NPOV)**: Detect biased language and promotional content
- **📚 Verifiability**: Check citation requirements and source quality
- **🚫 No Original Research**: Flag unsourced claims and synthesis
- **⚖️ Notability**: Assess if topic meets notability guidelines
- **🤝 Code of Conduct**: Ensure respectful, collaborative tone

### Quality Metrics
- **Readability Analysis**: Flesch reading score, sentence complexity, vocabulary level
- **Citation Quality**: Inline citations, citation density, reference formatting
- **Reference Assessment**: Source reliability, diversity, and recency
- **Structural Analysis**: Section organization, header hierarchy, content balance
- **Language Quality**: Grammar, spelling, and style consistency

### Multilingual Support (WikiIndaba 2025)
- **🌍 Multiple Languages**: Support for English, French, Arabic, Swahili, Hausa, Yoruba, Amharic, Zulu
- **🗣️ Language-specific Guidelines**: Adapted rules for different Wikipedia language editions
- **🌍 African Content Focus**: Special metrics for African topics and sources
- **📖 Translation Helper**: Compare articles across languages

### User Experience
- **💾 Auto-save**: Never lose your work with automatic saving
- **📊 Progress Tracking**: See your article quality improve in real-time
- **📤 Export Options**: Export to wikitext, PDF, or plain text
- **🎨 Syntax Highlighting**: Wikipedia markup syntax highlighting
- **📱 Mobile Friendly**: Write and check articles on any device
- **⚡ Offline Mode**: Work without internet, sync when connected

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wikipedia-quality-analyzer.git
cd wikipedia-quality-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📖 Usage Guide

### Analyzing an Article

1. **Search Method**: Type an article title in the search box to see auto-complete suggestions
2. **URL Method**: Paste a Wikipedia URL directly into the input field
3. **Click Analyze**: The tool will fetch the article and perform comprehensive analysis

### Understanding Scores

Each metric is scored from 0-100:

- **90-100**: Excellent quality, minimal improvements needed
- **70-89**: Good quality, minor enhancements recommended
- **50-69**: Fair quality, moderate improvements needed
- **0-49**: Needs significant work, major improvements required

### Score Breakdown

#### Readability (25% of overall score)
- **Flesch Score**: Reading ease based on sentence and word complexity
- **Sentence Length**: Average words per sentence
- **Complex Words**: Count of difficult vocabulary

#### Citations (25% of overall score)
- **Total Citations**: All reference markers in the article
- **Inline Citations**: Citations within the article text
- **Citation Density**: Citations per 1000 words

#### References (25% of overall score)
- **Total References**: External links and sources
- **Reliable Sources**: Academic, government, and reputable sources
- **Source Quality**: Percentage of high-quality sources

#### Structure (25% of overall score)
- **Introduction**: Presence of comprehensive intro section
- **Sections**: Proper article organization
- **Section Balance**: Even distribution of content

### Improvement Suggestions

The tool provides specific, actionable recommendations:
- **High Priority**: Critical issues affecting article quality
- **Medium Priority**: Important improvements for better readability
- **Low Priority**: Minor enhancements for polish

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with full IntelliSense
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful, consistent icon library

### API Integration
- **Wikipedia REST API**: Article content and metadata
- **Wikipedia Action API**: Search functionality and article parsing
- **CORS Handling**: Proper cross-origin request management

### Code Organization
```
src/
├── components/          # Reusable UI components
│   ├── ArticleInput.tsx    # Search and URL input
│   ├── AnalysisResults.tsx # Main results display
│   ├── ScoreCard.tsx       # Individual metric cards
│   ├── SuggestionsList.tsx # Improvement recommendations
│   └── RecentAnalyses.tsx  # Analysis history
├── services/           # Business logic and API calls
│   ├── wikipediaApi.ts    # Wikipedia API integration
│   └── qualityAnalyzer.ts # Article analysis algorithms
├── types/              # TypeScript type definitions
│   └── index.ts           # Shared interfaces
└── App.tsx             # Main application component
```

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality. All APIs used are public and don't require authentication.

### Customization Options
- **Scoring Weights**: Modify weights in `qualityAnalyzer.ts`
- **UI Theme**: Adjust colors in `tailwind.config.js`
- **API Endpoints**: Configure in `wikipediaApi.ts`

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Ensure responsive design
- Add proper error handling
- Write clear, self-documenting code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Wikipedia API for providing comprehensive article data
- Tailwind CSS for the excellent utility-first framework
- Lucide React for beautiful, consistent icons
- The Wikipedia editing community for inspiration

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Made with ❤️ for the Wikipedia community**