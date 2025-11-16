// AtiQr Export Service - Export training results in multiple formats

import { CorrectionItem } from '../types/training';

export class ExportService {
  
  static exportToPDF(
    originalText: string,
    corrections: CorrectionItem[],
    language: string
  ): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = this.generatePrintableHTML(originalText, corrections, language);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }

  static exportToCSV(corrections: CorrectionItem[]): void {
    const headers = ['Line', 'Category', 'Severity', 'Original Text', 'Corrected Text', 'Explanation'];
    const rows = corrections.map(c => [
      c.line,
      c.category,
      c.severity,
      `"${c.originalText.replace(/"/g, '""')}"`,
      `"${c.correctedText.replace(/"/g, '""')}"`,
      `"${c.explanation.replace(/"/g, '""')}"`
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    this.downloadFile(csv, 'atiqr-analysis.csv', 'text/csv');
  }

  static exportToJSON(
    originalText: string,
    corrections: CorrectionItem[],
    language: string
  ): void {
    const data = {
      tool: 'AtiQr',
      timestamp: new Date().toISOString(),
      language,
      originalText,
      corrections,
      summary: {
        total: corrections.length,
        critical: corrections.filter(c => c.severity === 'critical').length,
        important: corrections.filter(c => c.severity === 'important').length,
        recommended: corrections.filter(c => c.severity === 'recommended').length
      }
    };

    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, 'atiqr-analysis.json', 'application/json');
  }

  static exportToMarkdown(
    originalText: string,
    corrections: CorrectionItem[],
    language: string
  ): void {
    const markdown = this.generateMarkdown(originalText, corrections, language);
    this.downloadFile(markdown, 'atiqr-report.md', 'text/markdown');
  }

  private static generateMarkdown(
    originalText: string,
    corrections: CorrectionItem[],
    language: string
  ): string {
    let md = `# AtiQr Training Report\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Language:** ${language}\n`;
    md += `**Total Issues:** ${corrections.length}\n\n`;

    md += `## Summary\n\n`;
    md += `- 🔴 Critical: ${corrections.filter(c => c.severity === 'critical').length}\n`;
    md += `- 🟠 Important: ${corrections.filter(c => c.severity === 'important').length}\n`;
    md += `- 🔵 Suggestions: ${corrections.filter(c => c.severity === 'recommended').length}\n\n`;

    md += `## Original Text\n\n\`\`\`\n${originalText}\n\`\`\`\n\n`;

    md += `## Corrections\n\n`;
    corrections.forEach((correction, idx) => {
      md += `### ${idx + 1}. ${correction.category.toUpperCase()} (Line ${correction.line})\n\n`;
      md += `**Severity:** ${correction.severity}\n\n`;
      md += `**Issue:** ${correction.explanation}\n\n`;
      if (correction.originalText && correction.correctedText) {
        md += `**Original:** \`${correction.originalText}\`\n\n`;
        md += `**Corrected:** \`${correction.correctedText}\`\n\n`;
      }
      md += `**Learn more:** ${correction.guidelineLink}\n\n`;
      md += `---\n\n`;
    });

    return md;
  }

  private static generatePrintableHTML(
    originalText: string,
    corrections: CorrectionItem[],
    language: string
  ): string {
    const critical = corrections.filter(c => c.severity === 'critical').length;
    const important = corrections.filter(c => c.severity === 'important').length;
    const recommended = corrections.filter(c => c.severity === 'recommended').length;

    const correctionsHTML = corrections.map((c, idx) => {
      const textComparison = c.originalText && c.correctedText ? `
        <div class="text-comparison">
          <div>
            <strong style="color: #991b1b;">Original:</strong>
            <div class="text-box original">${this.escapeHtml(c.originalText)}</div>
          </div>
          <div>
            <strong style="color: #047857;">Corrected:</strong>
            <div class="text-box corrected">${this.escapeHtml(c.correctedText)}</div>
          </div>
        </div>
      ` : '';

      return `
    <div class="correction">
      <div class="correction-header">
        ${idx + 1}. ${c.category.toUpperCase()} 
        <span class="severity-badge severity-${c.severity}">${c.severity}</span>
        <span style="color: #6b7280; font-weight: normal;">(Line ${c.line})</span>
      </div>
      
      <div class="explanation">${this.escapeHtml(c.explanation)}</div>
      
      ${textComparison}
      
      <a href="${c.guidelineLink}" class="guideline-link" target="_blank">
        📖 Learn more about this guideline →
      </a>
    </div>
      `;
    }).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AtiQr Training Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #4b5563; margin-top: 30px; }
    .meta { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary-item { flex: 1; padding: 15px; border-radius: 8px; text-align: center; }
    .critical { background: #fee2e2; color: #991b1b; }
    .important { background: #fed7aa; color: #9a3412; }
    .recommended { background: #dbeafe; color: #1e40af; }
    .original-text { background: #f9fafb; padding: 15px; border-left: 4px solid #6b7280; margin: 20px 0; white-space: pre-wrap; }
    .correction { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; page-break-inside: avoid; }
    .correction-header { font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .severity-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .severity-critical { background: #fee2e2; color: #991b1b; }
    .severity-important { background: #fed7aa; color: #9a3412; }
    .severity-recommended { background: #dbeafe; color: #1e40af; }
    .text-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 10px 0; }
    .text-box { padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px; }
    .original { background: #fee2e2; border-left: 3px solid #ef4444; }
    .corrected { background: #d1fae5; border-left: 3px solid #10b981; }
    .explanation { color: #4b5563; margin: 10px 0; }
    .guideline-link { color: #2563eb; text-decoration: none; font-size: 14px; }
    @media print {
      body { margin: 0; padding: 20px; }
      .correction { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>🎓 AtiQr Training Report</h1>
  
  <div class="meta">
    <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
    <strong>Language:</strong> ${language}<br>
    <strong>Total Issues Found:</strong> ${corrections.length}
  </div>

  <div class="summary">
    <div class="summary-item critical">
      <div style="font-size: 32px; font-weight: bold;">${critical}</div>
      <div>Critical Issues</div>
    </div>
    <div class="summary-item important">
      <div style="font-size: 32px; font-weight: bold;">${important}</div>
      <div>Important Issues</div>
    </div>
    <div class="summary-item recommended">
      <div style="font-size: 32px; font-weight: bold;">${recommended}</div>
      <div>Suggestions</div>
    </div>
  </div>

  <h2>Original Text</h2>
  <div class="original-text">${this.escapeHtml(originalText)}</div>

  <h2>Corrections & Learning Points</h2>
  ${correctionsHTML}

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280;">
    <p>Generated by AtiQr - Wikipedia Training Tool for School Clubs</p>
  </div>
</body>
</html>
    `;
  }

  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
