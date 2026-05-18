import HandwritingCanvas from './HandwritingCanvas'
import { downloadAsPDF } from '../services/pdf'

function PreviewPanel({ text, rewrittenText, isLoading, error }) {

  function handleCopy() {
    if (rewrittenText) {
      navigator.clipboard.writeText(rewrittenText)
        .then(() => alert('Text copied to clipboard!'))
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
      <div className="px-5 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">Preview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Handwritten output</p>
        </div>
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
            Copy Text
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
            Download PDF
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-y-auto px-4">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4 mt-4">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Writing your assignment...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !rewrittenText && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-gray-400 text-sm">Your handwritten page will appear here</p>
            <p className="text-gray-300 text-xs mt-1">Type text on the left and click Generate</p>
          </div>
        )}

        {/* Handwriting canvas */}
        {!isLoading && rewrittenText && (
          <HandwritingCanvas text={rewrittenText} />
        )}

      </div>

    </div>
  )
}

export default PreviewPanel