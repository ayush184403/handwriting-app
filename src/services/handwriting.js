// ─── STYLE DEFINITIONS ───────────────────────────────────────────────────────
// Each style overrides the base config with its own personality

export const HANDWRITING_STYLES = {
  neat: {
    id: 'neat',
    label: '✒️ Neat',
    description: 'Clean and upright',
    fontFamily: 'Caveat',
    fontSize: 28,
    tiltRange: 0.03,
    wobbleY: 1.5,
    spacingJitter: 0.8,
    inkVariation: 15,
    lineHeight: 48,
    inkColor: { r: 20, g: 30, b: 80 },
  },
  messy: {
    id: 'messy',
    label: '🌀 Messy',
    description: 'Rushed and uneven',
    fontFamily: 'Architects Daughter',
    fontSize: 26,
    tiltRange: 0.12,
    wobbleY: 5,
    spacingJitter: 3,
    inkVariation: 45,
    lineHeight: 52,
    inkColor: { r: 10, g: 10, b: 60 },
  },
  bubbly: {
    id: 'bubbly',
    label: '🫧 Bubbly',
    description: 'Round and cheerful',
    fontFamily: 'Indie Flower',
    fontSize: 30,
    tiltRange: 0.05,
    wobbleY: 3,
    spacingJitter: 1.5,
    inkVariation: 20,
    lineHeight: 54,
    inkColor: { r: 30, g: 20, b: 90 },
  },
  lefty: {
    id: 'lefty',
    label: '🤚 Left-handed',
    description: 'Consistent leftward slant',
    fontFamily: 'Patrick Hand',
    fontSize: 27,
    tiltRange: 0.04,
    wobbleY: 2,
    spacingJitter: 1,
    inkVariation: 20,
    lineHeight: 48,
    inkColor: { r: 15, g: 25, b: 70 },
    baseTilt: -0.12,   // constant leftward lean
  },
  compact: {
    id: 'compact',
    label: '📐 Compact',
    description: 'Small and tight',
    fontFamily: 'Shadows Into Light',
    fontSize: 22,
    tiltRange: 0.04,
    wobbleY: 1.8,
    spacingJitter: 0.6,
    inkVariation: 18,
    lineHeight: 40,
    inkColor: { r: 25, g: 35, b: 85 },
  },
}

// ─── BASE PAGE CONFIG (same for all styles) ──────────────────────────────────
export const CONFIG = {
  pageWidth: 794,
  pageHeight: 1123,
  marginLeft: 80,
  marginTop: 100,
  paddingRight: 60,
  ruledLineColor: '#c8d8e8',
  marginLineColor: '#f4a0a0',
  paperColor: '#fffef6',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function jitter(range) {
  return (Math.random() - 0.5) * 2 * range
}

function drawPaper(ctx, pageCount) {
  const totalHeight = CONFIG.pageHeight * pageCount

  ctx.fillStyle = CONFIG.paperColor
  ctx.fillRect(0, 0, CONFIG.pageWidth, totalHeight)

  for (let page = 0; page < pageCount; page++) {
    const pageTop = page * CONFIG.pageHeight

    ctx.strokeStyle = CONFIG.ruledLineColor
    ctx.lineWidth = 1

    let y = pageTop + CONFIG.marginTop
    while (y < pageTop + CONFIG.pageHeight - 40) {
      ctx.beginPath()
      ctx.moveTo(CONFIG.marginLeft, y)
      ctx.lineTo(CONFIG.pageWidth - 20, y)
      ctx.stroke()
      y += CONFIG.lineHeight || 48
    }

    ctx.strokeStyle = CONFIG.marginLineColor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(CONFIG.marginLeft - 10, pageTop)
    ctx.lineTo(CONFIG.marginLeft - 10, pageTop + CONFIG.pageHeight)
    ctx.stroke()
  }
}

function drawLetter(ctx, letter, x, y, style) {
  const { r, g, b } = style.inkColor
  const v = style.inkVariation
  const inkR = Math.max(0, r + jitter(v))
  const inkG = Math.max(0, g + jitter(v))
  const inkB = Math.max(0, b + jitter(v))
  ctx.fillStyle = `rgb(${inkR}, ${inkG}, ${inkB})`

  const size = style.fontSize + jitter(2)
  ctx.font = `${size}px '${style.fontFamily}', cursive`

  // Base tilt (for left-handed) + random tilt
  const baseTilt = style.baseTilt || 0
  const tilt = baseTilt + jitter(style.tiltRange)
  const wobble = jitter(style.wobbleY)

  ctx.save()
  ctx.translate(x, y + wobble)
  ctx.rotate(tilt)
  ctx.fillText(letter, 0, 0)
  ctx.restore()

  return ctx.measureText(letter).width + jitter(style.spacingJitter)
}

// ─── MAIN RENDER FUNCTION ────────────────────────────────────────────────────
export function renderHandwriting(canvas, text, styleId = 'neat') {
  if (!text || !canvas) return

  const style = HANDWRITING_STYLES[styleId] || HANDWRITING_STYLES.neat
  const lineHeight = style.lineHeight
  const maxWidth = CONFIG.pageWidth - CONFIG.marginLeft - CONFIG.paddingRight
  const ctx = canvas.getContext('2d')

  // ── PASS 1: count lines ──
  ctx.font = `${style.fontSize}px '${style.fontFamily}', cursive`
  const words = text.split(' ')
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

  const linesPerPage = Math.floor(
    (CONFIG.pageHeight - CONFIG.marginTop - 40) / lineHeight
  )
  const pageCount = Math.max(1, Math.ceil(lineCount / linesPerPage))

  // ── SET CANVAS SIZE ──
  canvas.width = CONFIG.pageWidth
  canvas.height = CONFIG.pageHeight * pageCount

  // ── DRAW PAPER ──
  // Temporarily set lineHeight on CONFIG for drawPaper
  CONFIG.lineHeight = lineHeight
  drawPaper(ctx, pageCount)

  // ── PASS 2: draw letters ──
  let x = CONFIG.marginLeft
  let lineIndex = 0

  function getY(lineIdx) {
    const page = Math.floor(lineIdx / linesPerPage)
    const lineOnPage = lineIdx % linesPerPage
    return page * CONFIG.pageHeight + CONFIG.marginTop + lineOnPage * lineHeight
  }

  for (const word of words) {
    if (word === '') continue

    const wordWidth = ctx.measureText(word + ' ').width

    if (x + wordWidth > CONFIG.pageWidth - CONFIG.paddingRight && x > CONFIG.marginLeft) {
      lineIndex++
      x = CONFIG.marginLeft
    }

    const y = getY(lineIndex)

    for (const letter of word) {
      const letterWidth = drawLetter(ctx, letter, x, y, style)
      x += letterWidth
    }

    x += ctx.measureText(' ').width + jitter(style.spacingJitter)
  }
}