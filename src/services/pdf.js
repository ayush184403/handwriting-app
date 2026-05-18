import { jsPDF } from 'jspdf'
import { CONFIG } from './handwriting'

export async function downloadAsPDF(canvas, filename = 'assignment.pdf') {
  if (!canvas) {
    alert('Nothing to download yet — generate handwriting first.')
    return
  }

  // ── STEP A: Figure out page dimensions ──
  // jsPDF uses millimetres by default. A4 is 210mm x 297mm.
  const PDF_WIDTH_MM = 210
  const PDF_HEIGHT_MM = 297

  // How many pages does our canvas span?
  // Canvas height divided by one page height in pixels
  const totalCanvasHeight = canvas.height
  const onePageHeight = CONFIG.pageHeight  // in pixels (1123px = one A4 page)
  const pageCount = Math.ceil(totalCanvasHeight / onePageHeight)

  // ── STEP B: Create the PDF document ──
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // ── STEP C: For each page, crop that section of canvas and add to PDF ──
  for (let page = 0; page < pageCount; page++) {

    // Add a new page for every page after the first
    if (page > 0) {
      pdf.addPage()
    }

    // Create a temporary canvas for just this one page
    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = CONFIG.pageWidth
    pageCanvas.height = CONFIG.pageHeight

    const pageCtx = pageCanvas.getContext('2d')

    // Copy just this page's slice from the main canvas
    pageCtx.drawImage(
      canvas,           // source canvas
      0,                // source x
      page * CONFIG.pageHeight,  // source y (move down one page each time)
      CONFIG.pageWidth, // source width
      CONFIG.pageHeight,// source height
      0,                // destination x
      0,                // destination y
      CONFIG.pageWidth, // destination width
      CONFIG.pageHeight // destination height
    )

    // Convert this page canvas to a base64 PNG image
    const pageImageData = pageCanvas.toDataURL('image/png', 1.0)

    // Add the image to the PDF — fill the full A4 page
    pdf.addImage(
      pageImageData,   // image data
      'PNG',           // format
      0,               // x position (mm)
      0,               // y position (mm)
      PDF_WIDTH_MM,    // width (mm) — full page width
      PDF_HEIGHT_MM    // height (mm) — full page height
    )
  }

  // ── STEP D: Trigger the download ──
  pdf.save(filename)
}