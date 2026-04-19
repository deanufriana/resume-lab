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

    // Temporarily remove any CSS transform scaling from parent wrappers
    // so html2canvas captures at the true 800px width
    const scaledWrapper = element.closest('[style*="transform"]') as HTMLElement | null;
    const outerWrapper = scaledWrapper?.parentElement as HTMLElement | null;
    let originalTransform = '';
    let originalWrapperWidth = '';
    let originalPosition = '';
    let originalLeft = '';
    let originalOuterOverflow = '';
    let originalOuterHeight = '';

    if (scaledWrapper) {
      originalTransform = scaledWrapper.style.transform;
      originalWrapperWidth = scaledWrapper.style.width;
      originalPosition = scaledWrapper.style.position || getComputedStyle(scaledWrapper).position;
      originalLeft = scaledWrapper.style.left || getComputedStyle(scaledWrapper).left;

      scaledWrapper.style.transform = 'none';
      scaledWrapper.style.position = 'static';
      scaledWrapper.style.left = 'auto';
    }
    if (outerWrapper) {
      originalOuterOverflow = outerWrapper.style.overflow;
      originalOuterHeight = outerWrapper.style.height;
      outerWrapper.style.overflow = 'visible';
    }

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

    // Wait for all fonts to be fully loaded to prevent alignment shifts
    await document.fonts.ready;

    // Generate and save PDF
    await html2pdf().set(opt).from(element).save();

    // Restore original styles
    if (scaledWrapper) {
      scaledWrapper.style.transform = originalTransform;
      scaledWrapper.style.width = originalWrapperWidth;
      // If our original properties contained data, restore them. Otherwise, clear the inline styles we added.
      scaledWrapper.style.position = originalPosition === 'static' ? '' : originalPosition;
      scaledWrapper.style.left = originalLeft === 'auto' ? '' : originalLeft;
    }

    if (outerWrapper) {
      outerWrapper.style.overflow = originalOuterOverflow;
      outerWrapper.style.height = originalOuterHeight;
    }

    noPrintElements.forEach((el, index) => {
      (el as HTMLElement).style.display = originalDisplay[index] || '';
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
