# WikiIndaba Quality Analyzer - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/wikiindaba-quality-analyzer.git
cd wikiindaba-quality-analyzer

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open http://localhost:5173 in your browser. Done! 🎉

---

## 🎯 Try These Features Immediately

### 1. Basic Analysis (30 seconds)
1. Keep language as "English"
2. Type "Nelson Mandela" in search box
3. Click "Analyze Article"
4. See comprehensive quality scores

### 2. Multi-language Analysis (1 minute)
1. Change language to "Français (French)"
2. Type "Nelson Mandela"
3. Click "Analyze Article"
4. Compare with English version

### 3. African Content Metrics (1 minute)
1. Analyze "Lagos" or "African Union"
2. Scroll to "African Content Analysis" card
3. See African sources percentage
4. Read recommendations

### 4. Visual Analytics (30 seconds)
1. After any analysis
2. Check the Radar Chart
3. View Reading Time card
4. See Complexity Level

### 5. Batch Analysis (2 minutes)
1. Click "Batch" button in header
2. Enter multiple articles:
   ```
   Nelson Mandela
   Lagos
   African Union
   Nile River
   ```
3. Click "Analyze All"
4. Compare results

### 6. Export Results (30 seconds)
1. After analysis
2. Click "Export" button
3. Choose PDF, CSV, or JSON
4. Download and share

---

## 📁 Project Structure

```
wikiindaba-quality-analyzer/
├── src/
│   ├── components/          # React components
│   │   ├── LanguageSelector.tsx      # NEW: Language switcher
│   │   ├── AfricanContentCard.tsx    # NEW: African metrics
│   │   ├── RadarChart.tsx            # NEW: Visual breakdown
│   │   ├── ReadingTimeCard.tsx       # NEW: Reading info
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── multilingualWikipediaApi.ts    # NEW: Multi-language API
│   │   ├── africanContentAnalyzer.ts      # NEW: African metrics
│   │   ├── enhancedQualityAnalyzer.ts     # Quality analysis
│   │   └── ...
│   ├── types/               # TypeScript types
│   │   ├── wikiindaba.ts              # NEW: WikiIndaba types
│   │   └── index.ts
│   └── App.tsx              # Main app component
├── docs/                    # Documentation
├── WIKIINDABA_2025.md      # Hackathon documentation
├── IMPLEMENTATION_GUIDE.md  # Step-by-step guide
├── HACKATHON_SUMMARY.md    # Project summary
└── README.md               # Main readme
```

---

## 🔧 Key Files to Understand

### 1. `src/types/wikiindaba.ts`
Defines WikiIndaba-specific types:
- `SupportedLanguage` - Language codes
- `AfricanContentMetrics` - African metrics structure
- `SUPPORTED_LANGUAGES` - Language configurations

### 2. `src/services/africanContentAnalyzer.ts`
Analyzes African content:
- Counts African sources
- Assesses topic relevance
- Tracks local languages
- Generates recommendations

### 3. `src/services/multilingualWikipediaApi.ts`
Handles multi-language Wikipedia API:
- Fetches articles in any language
- Compares across languages
- Extracts language links

### 4. `src/components/AfricanContentCard.tsx`
Displays African metrics:
- African sources percentage
- Topic relevance score
- Local language count
- Cultural context score

---

## 🎨 Customization Quick Tips

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'wikiindaba': {
        primary: '#FF6B35',    // Orange
        secondary: '#004E89',  // Blue
      }
    }
  }
}
```

### Add New Language
Edit `src/types/wikiindaba.ts`:
```typescript
{
  code: 'ig',
  name: 'Igbo',
  nativeName: 'Igbo',
  wikipediaUrl: 'https://ig.wikipedia.org',
  direction: 'ltr'
}
```

### Adjust African Source Detection
Edit `src/services/africanContentAnalyzer.ts`:
```typescript
// Add more domains
const AFRICAN_DOMAINS = [
  '.za', '.ng', '.ke', // ... add more
];

// Add more institutions
const AFRICAN_INSTITUTIONS = [
  'african union', // ... add more
];
```

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix linting issues
npm run lint
```

### Issue: API requests failing
- Check internet connection
- Wikipedia API might be rate-limited (wait 1 minute)
- Try different article

---

## 📚 Next Steps

### For Developers
1. Read `IMPLEMENTATION_GUIDE.md` for detailed implementation
2. Check `src/services/` for business logic
3. Explore `src/components/` for UI components
4. Run `npm run lint` before committing

### For Designers
1. Check `src/components/` for UI components
2. Modify Tailwind classes for styling
3. Update colors in `tailwind.config.js`
4. Test responsive design on mobile

### For Contributors
1. Read `CONTRIBUTING.md` (if exists)
2. Fork the repository
3. Create feature branch
4. Submit pull request

### For Hackathon Participants
1. Read `WIKIINDABA_2025.md` for context
2. Check `HACKATHON_SUMMARY.md` for project overview
3. Try all features
4. Provide feedback

---

## 🎯 Common Tasks

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Linter
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

---

## 📞 Get Help

### Documentation
- `README.md` - Main documentation
- `WIKIINDABA_2025.md` - Hackathon info
- `IMPLEMENTATION_GUIDE.md` - Implementation details
- `docs/` - Additional documentation

### Community
- **Telegram:** WikiIndaba Hackathon Group
- **GitHub Issues:** Report bugs
- **Discussions:** Ask questions

### Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Development server starts without errors
- [ ] Can search for articles
- [ ] Language selector works
- [ ] Analysis completes successfully
- [ ] African metrics display
- [ ] Radar chart renders
- [ ] Export functions work
- [ ] Dark mode toggles
- [ ] Responsive on mobile

---

**Ready to contribute to WikiIndaba Hackathon 2025? Let's build amazing tools for African Wikimedia communities! 🚀**

**Questions? Check the docs or ask in the Telegram group!**
