import html2pdf from 'html2pdf.js';
import type { Resume } from '../types/resume';

export async function generatePDFFromElement(resumeData: Resume, element: HTMLElement): Promise<void> {
  try {
    // Hide page break indicators and info before generating PDF
    const noPrintElements = element.querySelectorAll('.no-print');
    const originalDisplay: string[] = [];
    noPrintElements.forEach((el) => {
      originalDisplay.push((el as HTMLElement).style.display);
      (el as HTMLElement).style.display = 'none';
    });

    // Configure html2pdf options for ATS-friendly PDF
    const opt = {
      margin: 10,
      filename: resumeData.basics?.name
        ? `${resumeData.basics.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['h2', 'h3'],
      },
    };

    // Generate and save PDF
    await html2pdf().set(opt).from(element).save();

    // Restore original display styles
    noPrintElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalDisplay[index] || '';
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
