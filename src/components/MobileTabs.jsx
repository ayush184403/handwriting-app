function MobileTabs({ activeTab, setActiveTab, hasOutput }) {
  return (
    <div className="flex md:hidden border-b border-gray-200 bg-white">

      <button
        onClick={() => setActiveTab('input')}
        className={`flex-1 py-3 text-sm font-medium transition-colors ${
          activeTab === 'input'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        ✏️ Write
      </button>

      <button
        onClick={() => setActiveTab('preview')}
        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
          activeTab === 'preview'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        👁️ Preview
        {/* Red dot indicator when output is ready */}
        {hasOutput && activeTab !== 'preview' && (
          <span className="absolute top-2 right-[calc(50%-24px)] w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

    </div>
  )
}

export default MobileTabs