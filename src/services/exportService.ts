import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AnalysisResult } from '../types';

export class ExportService {
  static async exportToPDF(analysis: AnalysisResult): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Wikipedia Article Quality Analysis', 20, 30);
    
    // Article info
    pdf.setFontSize(16);
    pdf.text(analysis.article.title, 20, 50);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Analysis Date: ${new Date(analysis.timestamp).toLocaleDateString()}`, 20, 60);
    pdf.text(`Article URL: ${analysis.article.url}`, 20, 70);
    
    // Overall Score
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Overall Quality Score: ${analysis.scores.overall}/100`, 20, 90);
    
    // Score breakdown
    let yPos = 110;
    const scores = [
      { name: 'Readability', score: analysis.scores.readability.score },
      { name: 'Citations', score: analysis.scores.citations.score },
      { name: 'References', score: analysis.scores.references.score },
      { name: 'Structure', score: analysis.scores.structure.score }
    ];
    
    pdf.setFontSize(12);
    pdf.text('Score Breakdown:', 20, yPos);
    yPos += 15;
    
    scores.forEach(({ name, score }) => {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${name}: ${score}/100`, 30, yPos);
      yPos += 12;
    });
    
    // Suggestions
    yPos += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Improvement Suggestions:', 20, yPos);
    yPos += 15;
    
    pdf.setFont('helvetica', 'normal');
    analysis.suggestions.forEach((suggestion, index) => {
      const lines = pdf.splitTextToSize(`${index + 1}. ${suggestion}`, pageWidth - 40);
      lines.forEach((line: string) => {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, 30, yPos);
        yPos += 8;
      });
      yPos += 5;
    });
    
    pdf.save(`${analysis.article.title.replace(/[^a-zA-Z0-9]/g, '_')}_quality_analysis.pdf`);
  }

  static exportToCSV(analyses: AnalysisResult[]): void {
    const headers = [
      'Title',
      'Date',
      'Overall Score',
      'Readability Score',
      'Citations Score',
      'References Score',
      'Structure Score',
      'Flesch Score',
      'Avg Sentence Length',
      'Total Citations',
      'Citation Density',
      'Total References',
      'Reliable Sources',
      'Has Introduction',
      'Has Sections',
      'Section Count',
      'URL'
    ];
    
    const rows = analyses.map(analysis => [
      analysis.article.title,
      new Date(analysis.timestamp).toLocaleDateString(),
      analysis.scores.overall,
      analysis.scores.readability.score,
      analysis.scores.citations.score,
      analysis.scores.references.score,
      analysis.scores.structure.score,
      analysis.scores.readability.fleschScore,
      analysis.scores.readability.averageSentenceLength,
      analysis.scores.citations.totalCitations,
      analysis.scores.citations.citationDensity,
      analysis.scores.references.totalReferences,
      analysis.scores.references.reliableSources,
      analysis.scores.structure.hasIntroduction,
      analysis.scores.structure.hasSections,
      analysis.scores.structure.sectionCount || 0,
      analysis.article.url
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wikipedia_quality_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static exportToJSON(analyses: AnalysisResult[]): void {
    const dataStr = JSON.stringify(analyses, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wikipedia_quality_analysis_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}