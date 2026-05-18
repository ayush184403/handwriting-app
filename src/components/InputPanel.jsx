function InputPanel({ text, setText, subject, setSubject, onGenerate, isLoading, assignmentsUsed, assignmentsLimit }) {
  const subjects = ['General', 'English', 'Science', 'History', 'Maths', 'Other']

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">

      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Your Assignment</h2>
        <p className="text-xs text-gray-400 mt-0.5">Paste or type the text you want handwritten</p>
      </div>

      <div className="px-5 py-3 border-b border-gray-100 flex gap-2 flex-wrap">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              subject === s
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-medium'
                : 'border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <textarea
        className="flex-1 p-5 text-sm text-gray-700 resize-none outline-none placeholder-gray-300 leading-relaxed"
        placeholder="Start typing your assignment here...

Example:
The water cycle is a continuous process that describes how water moves through the Earth's systems. It begins with evaporation, where heat from the sun converts liquid water into water vapor..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <span className="text-xs text-gray-400">{text.length} characters</span>
       <button
  onClick={onGenerate}
  disabled={isLoading || !text.trim() || assignmentsUsed >= assignmentsLimit}
  className={`text-sm px-5 py-2 rounded-lg font-medium transition-colors text-white ${
    isLoading || !text.trim() || assignmentsUsed >= assignmentsLimit
      ? 'bg-indigo-300 cursor-not-allowed'
      : 'bg-indigo-600 hover:bg-indigo-500'
  }`}
>
  {isLoading
    ? 'Generating...'
    : assignmentsUsed >= assignmentsLimit
    ? 'Limit Reached — Upgrade'
    : 'Generate Handwriting →'}
</button>
      </div>

    </div>
  )
}

export default InputPanel