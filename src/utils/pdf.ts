import html2pdf from 'html2pdf.js';
import type { Resume } from '../types/resume';

export async function generatePDFFromElement (resumeData: Resume, element: HTMLElement): Promise<void> {
  const container = document.createElement('div');

  try {
    // 1. Create a deep clone of the element to avoid mutating the live DOM
    const clone = element.cloneNode(true) as HTMLElement;

    // 2. Setup an off-screen container with the same width as the capture window
    // This prevents any visual "glitches" or layout jumps in the main UI
    Object.assign(container.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      width: '800px',
      backgroundColor: '#ffffff',
      zIndex: '-1000'
    });

    container.appendChild(clone);
    document.body.appendChild(container);

    // 3. Prepare the clone (hide non-print elements, ensure visible overflow)
    const noPrintElements = clone.querySelectorAll('.no-print');
    noPrintElements.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
    clone.style.overflow = 'visible';

    // 4. Configure html2pdf options for ATS-friendly PDF
    const opt = {
      margin: 0,
      filename: resumeData.basics?.name
        ? `${resumeData.basics.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
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

    // 5. Wait for all fonts to be fully loaded to prevent alignment shifts
    await document.fonts.ready;

    // 6. Generate and save PDF from the clone
    await html2pdf().set(opt).from(clone).save();

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    // 7. Cleanup: remove the temporary container from the DOM
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
