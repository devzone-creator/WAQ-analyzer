# Contributing Guide

Thank you for your interest in contributing to the Wikipedia Article Quality Analyzer! This guide will help you get started with contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git for version control
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/your-username/wikipedia-quality-analyzer.git
   cd wikipedia-quality-analyzer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173`

## 🛠️ Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Critical production fixes

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the coding standards outlined below
   - Write clear, descriptive commit messages
   - Test your changes thoroughly

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new scoring algorithm for citations"
   ```

4. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```bash
feat: add readability score visualization
fix: resolve citation counting bug in analyzer
docs: update API documentation
style: format code with prettier
refactor: extract scoring logic into separate service
test: add unit tests for quality analyzer
chore: update dependencies
```

## 📋 Coding Standards

### TypeScript Guidelines

1. **Use Strict Types**
   ```typescript
   // Good
   interface ArticleData {
     title: string;
     content: string;
     score: number;
   }

   // Avoid
   const data: any = fetchArticle();
   ```

2. **Prefer Interfaces over Types**
   ```typescript
   // Good
   interface QualityScore {
     overall: number;
     readability: number;
   }

   // Less preferred
   type QualityScore = {
     overall: number;
     readability: number;
   }
   ```

3. **Use Descriptive Names**
   ```typescript
   // Good
   const calculateReadabilityScore = (text: string): number => { ... }

   // Avoid
   const calc = (t: string): number => { ... }
   ```

### React Component Guidelines

1. **Functional Components with Hooks**
   ```typescript
   // Good
   export function ArticleAnalyzer({ article }: Props) {
     const [score, setScore] = useState<number>(0);
     // ...
   }

   // Avoid class components unless necessary
   ```

2. **Props Interface Definition**
   ```typescript
   interface ArticleAnalyzerProps {
     article: WikipediaArticle;
     onAnalysisComplete: (score: QualityScore) => void;
   }

   export function ArticleAnalyzer({ article, onAnalysisComplete }: ArticleAnalyzerProps) {
     // ...
   }
   ```

3. **Custom Hooks for Logic**
   ```typescript
   // Extract complex logic into custom hooks
   function useArticleAnalysis(article: WikipediaArticle) {
     const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
     const [loading, setLoading] = useState(false);
     
     // Analysis logic here
     
     return { analysis, loading, analyzeArticle };
   }
   ```

### CSS and Styling Guidelines

1. **Use Tailwind Utility Classes**
   ```tsx
   // Good
   <div className="bg-white rounded-lg shadow-md p-6">
     <h2 className="text-xl font-semibold text-gray-900">Title</h2>
   </div>
   ```

2. **Responsive Design**
   ```tsx
   // Always consider mobile-first
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   ```

3. **Consistent Spacing**
   ```tsx
   // Use consistent spacing scale (4, 6, 8, 12, 16, etc.)
   <div className="space-y-6 p-8">
   ```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (buttons, inputs)
│   ├── analysis/       # Analysis-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── services/           # API calls and business logic
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// Example test structure
describe('QualityAnalyzer', () => {
  describe('analyzeReadability', () => {
    it('should calculate correct Flesch score', () => {
      const article = createMockArticle();
      const result = QualityAnalyzer.analyzeReadability(article);
      expect(result.fleschScore).toBeGreaterThan(0);
    });
  });
});
```

### Integration Tests
```typescript
// Test component integration
describe('ArticleInput', () => {
  it('should search and display suggestions', async () => {
    render(<ArticleInput onAnalyze={mockAnalyze} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/search articles/i);
    fireEvent.change(input, { target: { value: 'climate' } });
    
    await waitFor(() => {
      expect(screen.getByText('Climate change')).toBeInTheDocument();
    });
  });
});
```

## 🎯 Areas for Contribution

### High Priority
1. **Enhanced Scoring Algorithms**
   - Improve readability calculations
   - Better citation quality assessment
   - More sophisticated reference analysis

2. **Performance Optimization**
   - Implement caching for API calls
   - Optimize bundle size
   - Add lazy loading for components

3. **Accessibility Improvements**
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader compatibility

### Medium Priority
1. **Additional Features**
   - Export analysis reports (PDF, CSV)
   - Comparison between articles
   - Historical analysis tracking
   - Batch analysis capabilities

2. **UI/UX Enhancements**
   - Dark mode support
   - Customizable themes
   - Advanced filtering options
   - Mobile app version

### Low Priority
1. **Internationalization**
   - Support for multiple Wikipedia languages
   - Localized scoring criteria
   - Multi-language interface

2. **Advanced Analytics**
   - Trend analysis over time
   - Category-based scoring
   - Editor collaboration features

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**: Browser, OS, device information
4. **Screenshots**: Visual evidence when applicable
5. **Console Logs**: Any error messages or warnings

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment**
- Browser: [e.g., Chrome 91]
- OS: [e.g., Windows 10]
- Device: [e.g., Desktop]
```

## 💡 Feature Requests

For feature requests, please provide:

1. **Use Case**: Why is this feature needed?
2. **Detailed Description**: What should the feature do?
3. **Mockups/Examples**: Visual representation if applicable
4. **Priority**: How important is this feature?

## 📝 Documentation

### Code Documentation
- Use JSDoc comments for functions and classes
- Include examples in documentation
- Keep README files up to date

### API Documentation
- Document all public methods
- Include parameter types and return values
- Provide usage examples

## 🔍 Code Review Process

### For Contributors
1. Ensure your code follows the style guide
2. Write clear commit messages
3. Include tests for new features
4. Update documentation as needed

### For Reviewers
1. Check code quality and style
2. Verify functionality works as expected
3. Ensure tests pass
4. Review documentation updates

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord/Slack**: Real-time chat (if available)
- **Email**: Direct contact for sensitive issues

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to the Wikipedia Article Quality Analyzer! Your efforts help make Wikipedia better for everyone. 🎉