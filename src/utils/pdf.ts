import { domToCanvas } from "modern-screenshot";
import { jsPDF } from "jspdf";
import type { Resume } from "../types/resume";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_MARGIN_Y_MM = 10;
const PRINTABLE_HEIGHT_MM = A4_HEIGHT_MM - PAGE_MARGIN_Y_MM * 2;
const PREVIEW_BASE_WIDTH_PX = 800;

export async function generatePDFFromElement(
  resumeData: Resume,
  element: HTMLElement,
): Promise<void> {
  const container = document.createElement("div");

  try {
    const clone = element.cloneNode(true) as HTMLElement;

    Object.assign(container.style, {
      position: "fixed",
      left: "-99999px",
      top: "0",
      width: `${PREVIEW_BASE_WIDTH_PX}px`,
      backgroundColor: "#ffffff",
      zIndex: "-1",
      pointerEvents: "none",
    });

    const noPrintElements = clone.querySelectorAll(".no-print");
    noPrintElements.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    clone.style.width = `${PREVIEW_BASE_WIDTH_PX}px`;
    clone.style.paddingTop = "0px";
    clone.style.paddingBottom = "0px";
    clone.style.transform = "none";
    clone.style.transition = "none";
    clone.style.border = "none";
    clone.style.boxShadow = "none";
    clone.style.minHeight = "0";
    clone.style.overflow = "visible";

    container.appendChild(clone);
    document.body.appendChild(container);

    await document.fonts.ready;

    // Push any atomic text/card block that straddles an A4 printable page boundary
    // onto the next page so lines are never sliced in half across pages.
    const cssPageHeightPx = Math.floor(PREVIEW_BASE_WIDTH_PX * (PRINTABLE_HEIGHT_MM / A4_WIDTH_MM));
    const blocks = Array.from(
      clone.querySelectorAll<HTMLElement>("header, h2, h3, li, p, .break-inside-avoid, footer"),
    );

    const processed = new WeakSet<HTMLElement>();

    for (const rawEl of blocks) {
      // Push the whole flex header row when an h3 sits beside a date column
      const el = rawEl.tagName === "H3" ? rawEl.closest<HTMLElement>(".flex") || rawEl : rawEl;

      if (processed.has(el)) continue;
      processed.add(el);

      const cloneTop = clone.getBoundingClientRect().top;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0 || rect.height >= cssPageHeightPx) continue;

      // Let tall work/project cards break between their inner bullets instead of jumping whole
      if (el.classList.contains("break-inside-avoid") && rect.height > 140) {
        continue;
      }

      const top = rect.top - cloneTop;
      const bottom = rect.bottom - cloneTop;
      const pageIndexAtTop = Math.floor(top / cssPageHeightPx);
      const pageEnd = (pageIndexAtTop + 1) * cssPageHeightPx;

      const isHeading = rawEl.tagName === "H2" || rawEl.tagName === "H3";
      const nextSiblingHeight = el.nextElementSibling?.getBoundingClientRect().height || 0;
      const minKeepWithNextPx = isHeading ? Math.min(60, nextSiblingHeight || 32) : 0;

      if (top < pageEnd && bottom + minKeepWithNextPx > pageEnd) {
        const pushPx = Math.ceil(pageEnd - top) + 4;
        const currentPaddingTop = Number.parseFloat(getComputedStyle(el).paddingTop) || 0;
        el.style.paddingTop = `${currentPaddingTop + pushPx}px`;
      }
    }

    const fullCanvas = await domToCanvas(clone, {
      scale: 2,
      backgroundColor: "#ffffff",
      width: PREVIEW_BASE_WIDTH_PX,
    });

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pageSliceHeightPx = Math.floor(fullCanvas.width * (PRINTABLE_HEIGHT_MM / A4_WIDTH_MM));
    let offsetY = 0;
    let pageIndex = 0;

    while (offsetY < fullCanvas.height) {
      const sliceHeight = Math.min(pageSliceHeightPx, fullCanvas.height - offsetY);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = fullCanvas.width;
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          fullCanvas,
          0,
          offsetY,
          fullCanvas.width,
          sliceHeight,
          0,
          0,
          fullCanvas.width,
          sliceHeight,
        );
      }

      if (pageIndex > 0) {
        pdf.addPage();
      }

      const sliceHeightMm = (sliceHeight * A4_WIDTH_MM) / fullCanvas.width;
      pdf.addImage(
        pageCanvas.toDataURL("image/jpeg", 0.96),
        "JPEG",
        0,
        PAGE_MARGIN_Y_MM,
        A4_WIDTH_MM,
        sliceHeightMm,
        undefined,
        "FAST",
      );

      offsetY += pageSliceHeightPx;
      pageIndex++;
    }

    const filename = resumeData.basics?.name
      ? `${resumeData.basics.name.replace(/\s+/g, "_")}_Resume.pdf`
      : "Resume.pdf";
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
