# Wikipedia Article Editor & Quality Checker
## WikiIndaba Hackathon 2025 Project

### 🎯 Project Vision

A real-time article quality checker and writing assistant that helps Wikipedia contributors write better articles by providing instant feedback based on Wikipedia's guidelines, policies, and best practices.

### 🌟 Key Features

#### 1. **Live Article Editor Canvas**
- Clean, distraction-free writing environment
- Real-time analysis as you type
- Syntax highlighting for Wikipedia markup
- Auto-save functionality
- Word and character count

#### 2. **Wikipedia Guidelines Compliance**
The tool automatically checks for:

**Core Content Policies:**
- ✅ **Neutral Point of View (NPOV)** - Detects biased language
- ✅ **Verifiability** - Checks citation requirements
- ✅ **No Original Research** - Flags unsourced claims

**Style Guidelines:**
- 🚫 **Weasel Words** - "some people say", "it is believed"
- 🚫 **Peacock Terms** - "legendary", "world-famous", "best"
- 🚫 **Promotional Language** - "cutting-edge", "industry-leading"

**Citation Quality:**
- 📚 Citation density checks
- 📖 Source reliability assessment
- 🔗 Reference formatting validation

#### 3. **Multilingual Support**
Support for multiple Wikipedia language editions:
- 🇬🇧 English
- 🇫🇷 French (Français)
- 🇸🇦 Arabic (العربية)
- 🇹🇿 Swahili (Kiswahili)
- 🇳🇬 Hausa
- 🇳🇬 Yoruba (Yorùbá)
- 🇪🇹 Amharic (አማርኛ)
- 🇿🇦 Zulu (isiZulu)

#### 4. **African Content Focus**
Special metrics for WikiIndaba 2025:
- 🌍 African source tracking
- 📊 African topic relevance scoring
- 🗣️ Local language reference detection
- 🎭 Cultural context assessment

### 📁 Project Structure

```
src/
├── components/
│   ├── ArticleEditor.tsx          # Main editor canvas with real-time feedback
│   ├── LanguageSelector.tsx       # Multi-language Wikipedia selector
│   ├── AfricanMetricsCard.tsx     # African content metrics display
│   └── [existing components...]
│
├── services/
│   ├── wikipediaGuidelinesChecker.ts    # Core guidelines validation
│   ├── africanContentAnalyzer.ts        # African content metrics
│   ├── multilingualWikipediaApi.ts      # Multi-language API support
│   └── [existing services...]
│
├── types/
│   ├── guidelines.ts              # Wikipedia guidelines definitions
│   ├── wikiindaba.ts             # WikiIndaba-specific types
│   └── index.ts                  # Core types
│
└── App.tsx                       # Main application
```

### 🔧 Technical Implementation

#### Guidelines Checker
The `WikipediaGuidelinesChecker` service analyzes content for:
1. **NPOV violations** - Biased phrases like "obviously", "clearly"
2. **Weasel words** - Vague attributions
3. **Peacock terms** - Promotional adjectives
4. **Citation needs** - Factual claims without sources
5. **Original research** - Unsourced conclusions

#### Real-time Feedback
- Issues are highlighted inline as you type
- Color-coded severity (error/warning/info)
- Specific suggestions for each issue
- Links to relevant Wikipedia guidelines

#### Compliance Scoring
```
Score = 100 
  - (Critical violations × 10)
  - (Important violations × 5)
  - (Recommended violations × 2)
```

### 🌍 WikiIndaba 2025 Alignment

#### Hackathon Goals Met:
1. ✅ **Improve African content representation**
   - Track African sources and topics
   - Support African languages
   - Cultural context assessment

2. ✅ **Bridge language communities**
   - Multilingual support (English, French, Arabic + African languages)
   - Cross-language article comparison
   - Translation helpers

3. ✅ **Build contributor capacity**
   - Real-time learning through feedback
   - Wikipedia guidelines education
   - Best practices enforcement

4. ✅ **Accessible and inclusive**
   - Mobile-friendly design
   - Offline capability
   - Low-bandwidth optimization

### 🚀 Usage Example

```typescript
// User writes in the editor:
"This legendary company is clearly the best in Africa."

// Tool provides instant feedback:
⚠️ Line 1 - WP:PEACOCK
   Peacock term detected: "legendary"
   💡 Use neutral, factual language with citations

⚠️ Line 1 - WP:NPOV
   Biased phrase detected: "clearly"
   💡 Remove or provide evidence

⚠️ Line 1 - WP:PEACOCK
   Peacock term detected: "best"
   💡 Use neutral, factual language with citations

ℹ️ Line 1 - WP:CITE
   This statement likely needs a citation
   💡 Add <ref>reliable source</ref> after factual claims
```

### 📊 Quality Metrics

The tool provides comprehensive scoring:
- **Overall Compliance Score** (0-100)
- **Readability Score** (Flesch, Gunning Fog, SMOG)
- **Citation Quality** (density, reliability, diversity)
- **Structure Score** (organization, balance)
- **African Content Score** (sources, relevance, cultural context)

### 🎓 Educational Value

The tool serves as a learning platform:
- Teaches Wikipedia policies through practice
- Provides context-specific suggestions
- Links to official guidelines
- Builds good editing habits

### 🔮 Future Enhancements

1. **AI-powered suggestions** - GPT-based rewriting suggestions
2. **Collaborative editing** - Real-time multi-user editing
3. **Template library** - Pre-built article structures
4. **Citation generator** - Automatic citation formatting
5. **Translation assistant** - Cross-language content comparison
6. **Wikidata integration** - Structured data support
7. **Image suggestions** - Wikimedia Commons integration
8. **Offline mode** - Full PWA support

### 📝 Wikipedia Policies Enforced

1. **WP:NPOV** - Neutral Point of View
2. **WP:V** - Verifiability
3. **WP:NOR** - No Original Research
4. **WP:CITE** - Citing Sources
5. **WP:RS** - Reliable Sources
6. **WP:MOS** - Manual of Style
7. **WP:WEASEL** - Avoid Weasel Words
8. **WP:PEACOCK** - Avoid Peacock Terms
9. **WP:CIVIL** - Civility
10. **WP:AGF** - Assume Good Faith

### 🤝 Code of Conduct Compliance

The tool promotes Wikipedia's Code of Conduct by:
- Encouraging neutral, respectful language
- Discouraging promotional content
- Promoting verifiable, sourced information
- Supporting collaborative editing practices
- Fostering inclusive, accessible content creation

### 📞 Contact & Contribution

**For WikiIndaba Hackathon 2025:**
- Event: November 21-23, 2025
- Organizer: Wiki Mentor Africa
- Project Category: Technical Tools for African Wikimedia Communities

**Phabricator Task:** [To be created]

**Team Members:** [Your team information]

---

**Built with ❤️ for the Wikipedia community and WikiIndaba 2025**
