# AtiQr - Wikipedia Training Tool
## For School Wikipedia Clubs

### 🎯 Project Vision

AtiQr is a Wikipedia training tool designed specifically for school Wikipedia clubs to help beginners, intermediate, and expert writers improve their editing skills through hands-on practice with real-time feedback.

### 💡 The Problem

Students in Wikipedia clubs face several challenges:
- **Lack of writing ideas**: Don't know what to write or how to start
- **Citation confusion**: Unsure when, where, and how to cite sources
- **Structure issues**: Don't understand Wikipedia's essay structure
- **Style mistakes**: Use biased or promotional language without realizing it
- **No feedback loop**: Write articles without knowing what's wrong

### ✨ The Solution: AtiQr

AtiQr provides a **dual-canvas workspace** where students can:
1. **Paste their drafts** and see corrections side-by-side
2. **Study Wikipedia articles** to learn from good examples
3. **Get instant feedback** with explanations for every issue
4. **Learn guidelines** through practice, not just reading
5. **Track progress** and master Wikipedia writing over time

### 🎨 Key Features

#### 1. **Dual Canvas Display**
- **Left Panel**: Original text with issues highlighted
- **Right Panel**: Corrected version showing improvements
- **Side-by-side comparison** makes learning visual and intuitive

#### 2. **Two Training Modes**

**Paste & Analyze Mode:**
- Students paste their draft paragraphs
- System analyzes for Wikipedia guideline violations
- Shows corrections with detailed explanations
- Perfect for practicing writing skills

**Article Study Mode:**
- Paste a Wikipedia article URL
- System analyzes the article's quality
- Highlights good practices and issues
- Learn from real Wikipedia content

#### 3. **Comprehensive Analysis**

AtiQr checks for:
- **Citation Issues**: Missing citations, citation placement
- **NPOV Violations**: Biased language like "clearly", "obviously"
- **Weasel Words**: Vague phrases like "some people say"
- **Peacock Terms**: Promotional language like "legendary", "best"
- **Original Research**: Personal opinions without sources
- **Structure Problems**: Missing sections, poor organization
- **Grammar & Style**: Language quality issues

#### 4. **Learning-Focused Feedback**

Each correction includes:
- **What's wrong**: Clear identification of the issue
- **Why it matters**: Explanation of the Wikipedia guideline
- **How to fix it**: Specific suggestion for improvement
- **Learn more**: Direct link to Wikipedia policy page

#### 5. **Multilingual Support**

Support for 8 languages commonly used in African Wikipedia communities:
- 🇬🇧 English
- 🇫🇷 Français (French)
- 🇸🇦 العربية (Arabic)
- 🇹🇿 Kiswahili (Swahili)
- 🇳🇬 Hausa
- 🇳🇬 Yorùbá (Yoruba)
- 🇪🇹 አማርኛ (Amharic)
- 🇿🇦 isiZulu (Zulu)

### 📚 Wikipedia Guidelines Covered

1. **WP:NPOV** - Neutral Point of View
2. **WP:V** - Verifiability
3. **WP:NOR** - No Original Research
4. **WP:CITE** - Citing Sources
5. **WP:WEASEL** - Avoid Weasel Words
6. **WP:PEACOCK** - Avoid Peacock Terms
7. **WP:MOS** - Manual of Style

### 🎓 Use Cases

#### For Beginners:
- Learn basic Wikipedia writing structure
- Understand when and how to cite sources
- Identify and fix common mistakes
- Build confidence through practice

#### For Intermediate Writers:
- Refine writing style
- Master NPOV and verifiability
- Improve citation quality
- Study well-written articles

#### For Expert Writers:
- Fine-tune advanced techniques
- Analyze complex articles
- Mentor others using the tool
- Ensure policy compliance

### 🏫 Perfect for Wikipedia Clubs

AtiQr is designed for group learning:
- **Workshop-friendly**: Project on screen for group analysis
- **Discussion starter**: Corrections spark learning conversations
- **Progress tracking**: See improvement over time
- **Self-paced**: Students can practice independently
- **Multilingual**: Supports diverse language backgrounds

### 🔧 Technical Architecture

```
src/
├── components/
│   ├── TrainingCanvas.tsx         # Main input interface
│   ├── DualCanvasDisplay.tsx      # Side-by-side correction view
│   └── [other components...]
│
├── services/
│   ├── trainingAnalyzer.ts        # Core analysis engine
│   ├── wikipediaGuidelinesChecker.ts  # Guideline validation
│   └── multilingualWikipediaApi.ts    # Multi-language support
│
├── types/
│   ├── training.ts                # Training-specific types
│   ├── guidelines.ts              # Wikipedia guideline types
│   └── wikiindaba.ts             # Language configurations
│
└── App.tsx                        # Main application
```

### 🎯 Example Workflow

**Student writes:**
```
This legendary company is clearly the best in Africa. 
Many people believe it has revolutionized the industry.
```

**AtiQr identifies:**
- 🔴 "legendary" - Peacock term (WP:PEACOCK)
- 🔴 "clearly" - Biased language (WP:NPOV)
- 🔴 "best" - Peacock term (WP:PEACOCK)
- 🟠 "Many people believe" - Weasel words (WP:WEASEL)
- 🟠 Missing citation - Needs source (WP:CITE)

**AtiQr suggests:**
```
[Company name] is a company in Africa.[citation needed] 
According to [source], it has contributed to industry development.
```

**Student learns:**
- Remove promotional language
- Use neutral, factual descriptions
- Cite specific sources instead of vague attributions
- Add citations for factual claims

### 📊 Learning Metrics (Future Enhancement)

Track student progress:
- **Common mistakes**: Which guidelines need more practice
- **Improvement score**: Quality improvement over time
- **Mastered guidelines**: Which policies they understand well
- **Practice sessions**: Number of articles analyzed
- **Citation accuracy**: Improvement in citation usage

### 🌟 Why "AtiQr"?

The name combines:
- **"Ati"**: Prefix meaning "super" or "excellent" in some African languages
- **"Qr"**: Short for "Quality Review"
- Easy to remember and pronounce
- Unique and brandable

### 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start the app**: `npm run dev`
4. **Open in browser**: `http://localhost:5173`
5. **Start training**: Paste text or article URL

### 🎯 Target Audience

- **Primary**: School Wikipedia club members (ages 13-18)
- **Secondary**: Wikipedia training workshops
- **Tertiary**: Individual learners improving their skills
- **Geographic**: Global, with focus on African communities

### 💪 Impact

AtiQr helps students:
- ✅ Write better Wikipedia articles
- ✅ Understand Wikipedia guidelines through practice
- ✅ Build confidence as editors
- ✅ Contribute quality content to Wikipedia
- ✅ Develop critical thinking about sources
- ✅ Learn proper citation practices
- ✅ Master neutral, encyclopedic writing

### 🔮 Future Enhancements

1. **Progress Dashboard**: Track learning over time
2. **Gamification**: Badges for mastering guidelines
3. **Collaborative Mode**: Group editing sessions
4. **AI Suggestions**: GPT-powered rewriting help
5. **Citation Generator**: Auto-format citations
6. **Template Library**: Pre-built article structures
7. **Offline Mode**: Practice without internet
8. **Export Reports**: Share progress with teachers

---

**AtiQr: Empowering the next generation of Wikipedia editors** 🎓📚✨
**Developer : Fritzbeing**