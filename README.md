# AtiQr - Wikipedia Training Tool

A Wikipedia training tool designed for school Wikipedia clubs to help beginners, intermediate, and expert writers improve their editing skills. Get real-time analysis, side-by-side corrections, and learn Wikipedia guidelines through practice.

**📚 Learn by Doing | 🎯 Real-time Corrections | 🌍 Multilingual Support | 📖 Wikipedia Guidelines Mastery**

![AtiQr Training Tool](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=AtiQr+Training+Tool)

## 🌟 Features

### Dual Canvas Training Mode
- **📝 Paste & Analyze**: Paste your draft and see corrections side-by-side
- **📖 Article Study Mode**: Analyze existing Wikipedia articles to learn from good examples
- **🎯 Visual Corrections**: Original text vs. improved version with detailed explanations
- **📋 Learning Points**: Understand why each correction matters
- **🔍 Citation Training**: Learn where and how to add proper citations

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

### Multilingual Support
- **🌍 8 Languages**: English, French, Arabic, Swahili, Hausa, Yoruba, Amharic, Zulu
- **🗣️ Language-specific Analysis**: Adapted guidelines for different Wikipedia editions
- **📖 Cross-language Learning**: Study articles in multiple languages
- **🎓 Beginner-friendly**: Perfect for school Wikipedia clubs

### Training Features
- **📊 Progress Tracking**: Track common mistakes and improvements over time
- **🎯 Targeted Learning**: Focus on specific Wikipedia guidelines
- **💡 Learning Points**: Understand the "why" behind each correction
- **📱 Mobile Friendly**: Practice on any device
- **🔗 Guideline Links**: Direct links to Wikipedia policy pages
- **👥 Perfect for Groups**: Ideal for school Wikipedia clubs and training sessions

### Export Features
- **🖨️ Print/PDF**: Generate printable training reports with full analysis
- **📝 Markdown**: Export to Markdown format for documentation
- **📊 CSV**: Export corrections to spreadsheet format for tracking
- **💾 JSON**: Export complete analysis data for developers
- **📤 Share with Teachers**: Save and share your progress for feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/atiqr.git
cd atiqr

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

### Two Training Modes

#### 1. Paste & Analyze Mode
1. Write or paste your Wikipedia draft in the text area
2. Select your language (English, French, Arabic, Swahili, etc.)
3. Click "Analyze & Learn"
4. Review corrections side-by-side with explanations

#### 2. Article Study Mode
1. Paste a Wikipedia article URL
2. Click "Analyze & Learn"
3. Study how the article follows (or breaks) Wikipedia guidelines
4. Learn from good examples and identify areas for improvement

### Understanding Corrections

AtiQr identifies three types of issues:

- **🔴 Critical (Errors)**: Violations of core Wikipedia policies (NPOV, Verifiability, No Original Research)
- **🟠 Important (Warnings)**: Style issues that affect article quality (weasel words, peacock terms)
- **🔵 Suggestions**: Recommendations for improvement (citation placement, structure)

### Learning from Corrections

Each correction includes:
- **Original Text**: What you wrote
- **Improved Version**: How it should be written
- **Explanation**: Why the change is needed
- **Guideline Link**: Direct link to Wikipedia policy page
- **Category**: Type of issue (citation, NPOV, style, etc.)

### Common Issues AtiQr Catches

1. **Missing Citations**: Factual claims without sources
2. **Biased Language**: Words like "clearly", "obviously", "best"
3. **Weasel Words**: Vague phrases like "some people say"
4. **Peacock Terms**: Promotional language like "legendary", "world-famous"
5. **Original Research**: Personal opinions or conclusions
6. **Poor Structure**: Missing sections or unbalanced content

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