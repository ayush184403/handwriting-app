import HandwritingCanvas from './HandwritingCanvas'
import { downloadAsPDF } from '../services/pdf'

function PreviewPanel({ text, rewrittenText, isLoading, error, selectedStyle }) {

  function handleCopy() {
    if (rewrittenText) {
      navigator.clipboard.writeText(rewrittenText)
        .then(() => alert('Copied!'))
    }
  }

  async function handleDownload() {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      alert('Generate handwriting first.')
      return
    }
    await downloadAsPDF(canvas, 'my-assignment.pdf')
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Panel header */}
      <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="hidden md:block">
          <h2 className="font-semibold text-gray-800">Preview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Handwritten output</p>
        </div>
        {/* On mobile the title shows inline with buttons */}
        <span className="md:hidden text-sm font-semibold text-gray-700">Handwriting Preview</span>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!rewrittenText}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              rewrittenText
                ? 'border-gray-200 text-gray-500 hover:border-gray-300 cursor-pointer'
                : 'border-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            disabled={!rewrittenText}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              rewrittenText
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer'
                : 'bg-indigo-200 text-white cursor-not-allowed'
            }`}
          >
            PDF ↓
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4 mt-4">
            ⚠️ {error}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Writing your assignment...</p>
          </div>
        )}

        {!isLoading && !rewrittenText && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-gray-400 text-sm">Your handwritten page appears here</p>
            <p className="text-gray-300 text-xs mt-1">
              {window.innerWidth < 768
                ? 'Tap Write tab, type text, then Generate'
                : 'Type text on the left and click Generate'}
            </p>
          </div>
        )}

       {!isLoading && rewrittenText && (
  <HandwritingCanvas text={rewrittenText} styleId={selectedStyle} />
)}

      </div>

    </div>
  )
}

export default PreviewPanel