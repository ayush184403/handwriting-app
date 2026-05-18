import { useEffect, useRef } from 'react'
import { renderHandwriting } from '../services/handwriting'

function HandwritingCanvas({ text, styleId }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!text) return
    const canvas = canvasRef.current
    if (!canvas) return

    const timer = setTimeout(() => {
      renderHandwriting(canvas, text, styleId)
    }, 100)

    return () => clearTimeout(timer)
  }, [text, styleId])  // re-render when either text OR style changes

  if (!text) return null

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <canvas
        ref={canvasRef}
        className="shadow-xl rounded-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  )
}

export default HandwritingCanvas