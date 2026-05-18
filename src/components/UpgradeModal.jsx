function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✍️</div>
          <h2 className="text-2xl font-bold text-gray-900">You've used all 3 free assignments</h2>
          <p className="text-gray-500 text-sm mt-2">
            Upgrade to keep generating unlimited handwritten assignments
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            '♾️ Unlimited assignments per month',
            '📄 PDF download (not just PNG)',
            '🖊️ 5 handwriting styles to choose from',
            '📚 Assignment history saved',
            '⚡ Priority generation speed',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-sm text-gray-600">
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl font-bold text-indigo-700">₹99<span className="text-lg font-normal text-indigo-400">/month</span></div>
          <div className="text-xs text-indigo-400 mt-1">Cancel anytime</div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors mb-3">
          Upgrade Now →
        </button>
        <button
          onClick={onClose}
          className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          Maybe later
        </button>

      </div>
    </div>
  )
}

export default UpgradeModal