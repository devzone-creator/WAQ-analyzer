# API Documentation

## Wikipedia API Integration

The Wikipedia Article Quality Analyzer integrates with multiple Wikipedia APIs to fetch comprehensive article data.

### Endpoints Used

#### 1. OpenSearch API
**Purpose**: Article search with auto-complete suggestions

```
GET https://en.wikipedia.org/w/api.php?action=opensearch&search={query}&limit=5&format=json&origin=*
```

**Parameters**:
- `search`: Search query string
- `limit`: Maximum number of results (default: 5)
- `format`: Response format (json)
- `origin`: CORS header (*)

**Response Format**:
```json
[
  "search term",
  ["Article 1", "Article 2", "Article 3"],
  ["Description 1", "Description 2", "Description 3"],
  ["URL 1", "URL 2", "URL 3"]
]
```

#### 2. Query API - Article Content
**Purpose**: Fetch article extracts, sections, and metadata

```
GET https://en.wikipedia.org/w/api.php?action=query&format=json&titles={title}&prop=extracts|sections|extlinks|categories&exintro=&explaintext=&origin=*
```

**Parameters**:
- `titles`: Article title
- `prop`: Properties to fetch (extracts, sections, extlinks, categories)
- `exintro`: Extract introduction only
- `explaintext`: Plain text format
- `origin`: CORS header

**Response Structure**:
```json
{
  "query": {
    "pages": {
      "pageId": {
        "title": "Article Title",
        "extract": "Article introduction text...",
        "sections": [...],
        "extlinks": [...],
        "categories": [...]
      }
    }
  }
}
```

#### 3. Query API - Wikitext Content
**Purpose**: Fetch raw wikitext for citation analysis

```
GET https://en.wikipedia.org/w/api.php?action=query&format=json&titles={title}&prop=revisions&rvprop=content&origin=*
```

**Parameters**:
- `titles`: Article title
- `prop`: revisions
- `rvprop`: content
- `origin`: CORS header

**Response Structure**:
```json
{
  "query": {
    "pages": {
      "pageId": {
        "revisions": [
          {
            "*": "Raw wikitext content..."
          }
        ]
      }
    }
  }
}
```

### Error Handling

#### Common Error Scenarios
1. **Article Not Found**: Page ID returns -1
2. **Network Errors**: Connection timeouts or failures
3. **Rate Limiting**: Too many requests (rare with current usage)
4. **CORS Issues**: Browser blocking cross-origin requests

#### Error Response Format
```json
{
  "error": {
    "code": "error_code",
    "info": "Error description"
  }
}
```

### Rate Limiting
- Wikipedia APIs have generous rate limits for reasonable usage
- Current implementation includes natural throttling through user interaction
- No authentication required for read-only access

### Best Practices
1. **Caching**: Consider implementing client-side caching for repeated requests
2. **Debouncing**: Search requests are debounced to reduce API calls
3. **Error Recovery**: Graceful degradation when APIs are unavailable
4. **User Feedback**: Clear loading states and error messages

## Internal API Structure

### WikipediaService Class

#### Methods

##### `searchArticles(query: string): Promise<string[]>`
Searches for articles matching the query string.

**Parameters**:
- `query`: Search term

**Returns**: Array of article titles

**Example**:
```typescript
const results = await WikipediaService.searchArticles('climate change');
// Returns: ['Climate change', 'Climate change mitigation', ...]
```

##### `getArticleContent(title: string): Promise<ArticleData>`
Fetches comprehensive article data including content and metadata.

**Parameters**:
- `title`: Article title

**Returns**: ArticleData object

**Example**:
```typescript
const article = await WikipediaService.getArticleContent('Climate change');
// Returns: { title, extract, content, sections, extlinks, categories }
```

##### `extractUrlTitle(url: string): string | null`
Extracts article title from Wikipedia URL.

**Parameters**:
- `url`: Wikipedia URL

**Returns**: Article title or null

**Example**:
```typescript
const title = WikipediaService.extractUrlTitle('https://en.wikipedia.org/wiki/Climate_change');
// Returns: 'Climate change'
```

### QualityAnalyzer Class

#### Methods

##### `analyzeArticle(article: WikipediaArticle): QualityScore`
Performs comprehensive quality analysis on an article.

**Parameters**:
- `article`: WikipediaArticle object

**Returns**: QualityScore with all metrics

##### `generateSuggestions(scores: QualityScore): string[]`
Generates improvement suggestions based on quality scores.

**Parameters**:
- `scores`: QualityScore object

**Returns**: Array of suggestion strings

### Data Types

#### WikipediaArticle
```typescript
interface WikipediaArticle {
  title: string;
  extract: string;
  content: string;
  url: string;
  sections: WikipediaSection[];
  references: string[];
  externalLinks: string[];
}
```

#### QualityScore
```typescript
interface QualityScore {
  overall: number;
  readability: ReadabilityScore;
  citations: CitationScore;
  references: ReferenceScore;
  structure: StructureScore;
}
```

#### ReadabilityScore
```typescript
interface ReadabilityScore {
  score: number;
  averageSentenceLength: number;
  averageWordLength: number;
  complexWords: number;
  fleschScore: number;
}
```

#### CitationScore
```typescript
interface CitationScore {
  score: number;
  totalCitations: number;
  inlineCitations: number;
  citationDensity: number;
}
```

#### ReferenceScore
```typescript
interface ReferenceScore {
  score: number;
  totalReferences: number;
  reliableSources: number;
  externalLinks: number;
  sourceQuality: number;
}
```

#### StructureScore
```typescript
interface StructureScore {
  score: number;
  hasIntroduction: boolean;
  hasSections: boolean;
  hasReferences: boolean;
  sectionBalance: number;
  headerHierarchy: number;
}
```