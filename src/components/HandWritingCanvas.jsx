import { useEffect, useRef } from 'react'
import { renderHandwriting } from '../services/handwriting'

function HandwritingCanvas({ text }) {
  // useRef gives us a direct reference to the <canvas> DOM element
  const canvasRef = useRef(null)

  // useEffect runs after the component renders
  // The [text] at the end means: re-run whenever text changes
  useEffect(() => {
    if (!text) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Small delay so the font is definitely loaded before we draw
    const timer = setTimeout(() => {
      renderHandwriting(canvas, text)
    }, 100)

    return () => clearTimeout(timer)
  }, [text])

  if (!text) return null

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Shadow gives it the "floating page" look */}
      <canvas
        ref={canvasRef}
        className="shadow-xl rounded-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  )
}

export default HandwritingCanvas