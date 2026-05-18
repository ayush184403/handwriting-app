// ─── CONFIGURATION ───────────────────────────────────────────────────────────
// All the numbers that control how the handwriting looks.
// Tweak these later to change the style.

const CONFIG = {
  // Page layout
  pageWidth: 794,          // A4 width in pixels at 96dpi
  pageHeight: 1123,        // A4 height in pixels
  marginLeft: 80,          // left margin (red line position)
  marginTop: 100,          // where first line starts
  lineHeight: 48,          // space between ruled lines
  paddingRight: 60,        // gap before right edge

  // Text style
  fontSize: 28,            // base font size in pixels
  fontFamily: 'Caveat',    // the Google Font we loaded

  // Handwriting randomness — this is what makes it look human
  tiltRange: 0.06,         // max letter rotation in radians (~3.4 degrees)
  wobbleY: 2.5,            // max vertical wobble per letter (pixels)
  spacingJitter: 1.2,      // extra random horizontal gap between letters
  inkVariation: 30,        // how much the ink color varies (0=uniform)

  // Colors
  ruledLineColor: '#c8d8e8',   // the blue horizontal lines
  marginLineColor: '#f4a0a0',  // the pink/red margin line
  paperColor: '#fffef6',       // slight warm off-white paper
  inkColor: { r: 20, g: 30, b: 80 }, // base ink color (dark blue-black)
}

// ─── HELPER: random number between -range and +range ─────────────────────────
function jitter(range) {
  return (Math.random() - 0.5) * 2 * range
}

// ─── HELPER: draw the ruled paper background ─────────────────────────────────
function drawPaper(ctx, pageCount) {
  const totalHeight = CONFIG.pageHeight * pageCount

  // Paper background
  ctx.fillStyle = CONFIG.paperColor
  ctx.fillRect(0, 0, CONFIG.pageWidth, totalHeight)

  // Draw ruled lines across all pages
  for (let page = 0; page < pageCount; page++) {
    const pageTop = page * CONFIG.pageHeight

    // Horizontal ruled lines
    ctx.strokeStyle = CONFIG.ruledLineColor
    ctx.lineWidth = 1

    let y = pageTop + CONFIG.marginTop
    while (y < pageTop + CONFIG.pageHeight - 40) {
      ctx.beginPath()
      ctx.moveTo(CONFIG.marginLeft, y)
      ctx.lineTo(CONFIG.pageWidth - 20, y)
      ctx.stroke()
      y += CONFIG.lineHeight
    }

    // Vertical margin line (the red/pink one on the left)
    ctx.strokeStyle = CONFIG.marginLineColor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(CONFIG.marginLeft - 10, pageTop)
    ctx.lineTo(CONFIG.marginLeft - 10, pageTop + CONFIG.pageHeight)
    ctx.stroke()
  }
}

// ─── HELPER: draw one letter with randomness ─────────────────────────────────
function drawLetter(ctx, letter, x, y) {
  // Random ink color variation — slightly different each letter
  const { r, g, b } = CONFIG.inkColor
  const v = CONFIG.inkVariation
  const inkR = Math.max(0, r + jitter(v))
  const inkG = Math.max(0, g + jitter(v))
  const inkB = Math.max(0, b + jitter(v))
  ctx.fillStyle = `rgb(${inkR}, ${inkG}, ${inkB})`

  // Random font size variation — very subtle
  const size = CONFIG.fontSize + jitter(2)
  ctx.font = `${size}px '${CONFIG.fontFamily}', cursive`

  // Random tilt (rotation)
  const tilt = jitter(CONFIG.tiltRange)

  // Random vertical wobble
  const wobble = jitter(CONFIG.wobbleY)

  // Save canvas state, move to letter position, rotate, draw, restore
  ctx.save()
  ctx.translate(x, y + wobble)
  ctx.rotate(tilt)
  ctx.fillText(letter, 0, 0)
  ctx.restore()

  // Return how wide this letter was (so next letter knows where to start)
  return ctx.measureText(letter).width + jitter(CONFIG.spacingJitter)
}

// ─── MAIN: render text onto canvas ───────────────────────────────────────────
export function renderHandwriting(canvas, text) {
  if (!text || !canvas) return

  // Split text into words first
  const words = text.split(' ')

  // We'll do a "dry run" first to figure out how many pages we need,
  // then a real run to actually draw. This is a two-pass approach.

  const maxWidth = CONFIG.pageWidth - CONFIG.marginLeft - CONFIG.paddingRight
  const ctx = canvas.getContext('2d')

  // ── PASS 1: calculate total lines needed ──
  ctx.font = `${CONFIG.fontSize}px '${CONFIG.fontFamily}', cursive`

  let lineCount = 1
  let currentLineWidth = 0

  for (const word of words) {
    const wordWidth = ctx.measureText(word + ' ').width
    if (currentLineWidth + wordWidth > maxWidth && currentLineWidth > 0) {
      lineCount++
      currentLineWidth = wordWidth
    } else {
      currentLineWidth += wordWidth
    }
  }

  // How many pages do we need?
  const linesPerPage = Math.floor(
    (CONFIG.pageHeight - CONFIG.marginTop - 40) / CONFIG.lineHeight
  )
  const pageCount = Math.max(1, Math.ceil(lineCount / linesPerPage))

  // ── SET CANVAS SIZE ──
  canvas.width = CONFIG.pageWidth
  canvas.height = CONFIG.pageHeight * pageCount

  // ── DRAW PAPER ──
  drawPaper(ctx, pageCount)

  // ── PASS 2: draw each word, letter by letter ──
  let x = CONFIG.marginLeft
  let lineIndex = 0  // which ruled line we're on (across all pages)

  function getY(lineIdx) {
    // Which page is this line on?
    const page = Math.floor(lineIdx / linesPerPage)
    const lineOnPage = lineIdx % linesPerPage
    return page * CONFIG.pageHeight + CONFIG.marginTop + lineOnPage * CONFIG.lineHeight
  }

  for (const word of words) {
    // Handle newlines in the text
    if (word === '\n' || word === '') {
      if (word === '\n') {
        lineIndex++
        x = CONFIG.marginLeft
      }
      continue
    }

    const wordWidth = ctx.measureText(word + ' ').width

    // If this word doesn't fit on the current line, go to next line
    if (x + wordWidth > CONFIG.pageWidth - CONFIG.paddingRight && x > CONFIG.marginLeft) {
      lineIndex++
      x = CONFIG.marginLeft
    }

    const y = getY(lineIndex)

    // Draw each letter of the word individually
    for (const letter of word) {
      const letterWidth = drawLetter(ctx, letter, x, y)
      x += letterWidth
    }

    // Add a space after the word
    x += ctx.measureText(' ').width + jitter(CONFIG.spacingJitter)
  }
}

// ─── EXPORT: also export config so UI can reference page width ────────────────
export { CONFIG }