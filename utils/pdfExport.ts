import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a high-quality PDF from an HTML element
 */
export async function generatePdfBlob(
  element: HTMLElement,
  fileName: string
): Promise<{ blob: Blob; file: File; pdf: jsPDF }> {
  // Capture with high resolution and clean white background
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20; // 10mm margins on left/right
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10; // Top margin

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= (pageHeight - 20);

  // Multi-page support if the table or report is long
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - 20);
  }

  const pdfBlob = pdf.output('blob');
  const file = new File([pdfBlob], fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`, {
    type: 'application/pdf',
  });

  return { blob: pdfBlob, file, pdf };
}

/**
 * Saves/Downloads the PDF directly to device
 */
export async function saveElementAsPdf(element: HTMLElement, fileName: string): Promise<void> {
  const { pdf } = await generatePdfBlob(element, fileName);
  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
}

/**
 * Shares the PDF using Web Share API or falls back to direct download
 */
export async function shareElementAsPdf(
  element: HTMLElement,
  fileName: string,
  title: string
): Promise<'shared' | 'downloaded'> {
  try {
    const { file, pdf } = await generatePdfBlob(element, fileName);

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text: `${title} generated from My GiG Jobs`,
        files: [file],
      });
      return 'shared';
    } else {
      pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
      return 'downloaded';
    }
  } catch (error: any) {
    // If user cancelled share dialog, ignore error or download
    if (error?.name === 'AbortError') {
      return 'shared';
    }
    // Fallback save
    await saveElementAsPdf(element, fileName);
    return 'downloaded';
  }
}
