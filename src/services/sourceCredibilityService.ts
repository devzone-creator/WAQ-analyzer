/**
 * Source Credibility Service
 * Validates domain reliability tiers for Step 1 (Notability Check)
 * Categorizes sources as high, medium, low, or unknown credibility
 */

import { Source } from '../types/waca';

export class SourceCredibilityService {
  // Known reliable domains by tier
  private static readonly HIGH_CREDIBILITY_DOMAINS = [
    // Academic/Research
    '.edu',
    '.ac.uk',
    '.ac.jp',
    '.gov.uk',
    '.gov',
    '.org.uk',
    // Major news organizations
    'bbc.com',
    'bbc.co.uk',
    'reuters.com',
    'apnews.com',
    'theguardian.com',
    'nytimes.com',
    'washingtonpost.com',
    'ft.com',
    'economist.com',
    'aljazeera.com',
    // Reputable institutions
    'britannica.com',
    'encyclopediaoflife.org',
    'nature.com',
    'science.org',
    'sciencedaily.com',
    'pnas.org',
    'wikipedia.org'
  ];

  private static readonly MEDIUM_CREDIBILITY_DOMAINS = [
    // Professional/Industry publications
    'forbes.com',
    'techcrunch.com',
    'arstechnica.com',
    'wired.com',
    'medium.com',
    // Magazine publishers
    'smithsonianmag.com',
    'nationalgeographic.com',
    'publicdomainreview.org',
    // Reputable international news
    'bbc.com',
    'cnn.com',
    'bloomberg.com'
  ];

  private static readonly LOW_CREDIBILITY_PATTERNS = [
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'tiktok.com',
    'reddit.com',
    'quora.com',
    'pinterest.com',
    'linkedin.com',
    'youtube.com', // Unless official channel
    'blog.', // Requires verification
    'wordpress.com',
    'medium.com' // User-generated
  ];

  /**
   * Validate a single source and return credibility tier
   */
  static async validateSource(
    url: string,
    title: string
  ): Promise<Source> {
    const domain = this.extractDomain(url);
    const tier = this.assessCredibilityTier(domain);
    const isIndependent = this.checkIndependence(url, domain);
    const isReliable = tier !== 'low';

    // Simulate async verification (in production, would check URL availability, SSL, etc.)
    const verified = await this.verifySourceExists(url);

    return {
      url,
      title,
      domain,
      credibilityTier: tier,
      isIndependent,
      isReliable,
      verified,
      verificationError: verified ? undefined : `Could not verify: ${url}`
    };
  }

  /**
   * Validate multiple sources for notability
   * Returns true if at least 3 high/medium quality independent reliable sources found
   */
  static async validateNotability(sources: Source[]): Promise<{
    gngProven: boolean;
    validSources: Source[];
    message: string;
  }> {
    // Filter for independent, reliable sources
    const validSources = sources.filter(
      s => s.isIndependent && s.isReliable && s.verified
    );

    const gngProven = validSources.length >= 3;

    let message = '';
    if (gngProven) {
      message = `✓ Notability proven! Found ${validSources.length} independent reliable sources.`;
    } else {
      const needed = 3 - validSources.length;
      message = `✗ Need ${needed} more independent reliable source(s) to prove notability.`;
    }

    return {
      gngProven,
      validSources,
      message
    };
  }

  /**
   * Extract domain from URL
   */
  private static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  /**
   * Assess credibility tier based on domain
   */
  private static assessCredibilityTier(
    domain: string
  ): 'high' | 'medium' | 'low' | 'unknown' {
    // Exact matches for high-tier
    if (
      this.HIGH_CREDIBILITY_DOMAINS.some(
        d => domain === d || domain.endsWith(d)
      )
    ) {
      return 'high';
    }

    // Exact matches for medium-tier
    if (
      this.MEDIUM_CREDIBILITY_DOMAINS.some(
        d => domain === d || domain.endsWith(d)
      )
    ) {
      return 'medium';
    }

    // Pattern matches for low-tier
    if (
      this.LOW_CREDIBILITY_PATTERNS.some(
        pattern => domain.includes(pattern)
      )
    ) {
      return 'low';
    }

    // Check for educational/government domains
    if (domain.endsWith('.edu') || domain.endsWith('.gov')) {
      return 'high';
    }

    // Check for organization domains
    if (domain.endsWith('.org') || domain.endsWith('.ac.uk')) {
      return 'high';
    }

    return 'unknown';
  }

  /**
   * Check if source appears to be independent
   * (not affiliated with the subject itself)
   */
  private static checkIndependence(url: string, domain: string): boolean {
    // Social media is not independent
    if (this.LOW_CREDIBILITY_PATTERNS.some(p => domain.includes(p))) {
      return false;
    }

    // Official websites of subjects are not independent
    // (simplified check - in production, would use more sophisticated logic)
    if (url.includes('official') || url.includes('mysite') || url.includes('personal')) {
      return false;
    }

    return true;
  }

  /**
   * Simulate verifying source exists (in production, would do HTTP HEAD request)
   */
  private static async verifySourceExists(url: string): Promise<boolean> {
    try {
      // In production environment, this would make a real HTTP request
      // For now, simulate success for valid URLs
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Simple heuristic: if it has a valid domain structure
        return this.extractDomain(url).includes('.');
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Provide suggestions for improving source credibility
   */
  static getSuggestionForTier(tier: 'high' | 'medium' | 'low' | 'unknown'): string {
    switch (tier) {
      case 'high':
        return 'Excellent source! High-credibility independent source accepted.';
      case 'medium':
        return 'Good source. Medium-credibility source can help support notability.';
      case 'low':
        return 'Weak source. Social media, blogs, and user-generated content are not reliable sources for notability.';
      case 'unknown':
        return 'Unknown source. Verify it is an independent, reliable publication before relying on it.';
    }
  }

  /**
   * Get explanation for credibility tier
   */
  static getCredibilityExplanation(): string {
    return `
Sources are evaluated using these criteria:
- HIGH: Academic institutions, government agencies, major news organizations, peer-reviewed publications
- MEDIUM: Reputable business publications, industry news, established online magazines
- LOW: Social media, personal blogs, user-generated content, forums
- UNKNOWN: Unrecognized domains - require verification

To prove notability under Wikipedia's General Notability Guideline (GNG):
✓ You need at least 3 independent, reliable sources
✓ Sources must be published by independent organizations
✓ Sources cannot be the subject's own website or social media
✓ Coverage must be significant (not just a brief mention)
    `;
  }
}
