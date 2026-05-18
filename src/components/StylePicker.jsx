import { HANDWRITING_STYLES } from '../services/handwriting'

function StylePicker({ selectedStyle, setSelectedStyle }) {
  const styles = Object.values(HANDWRITING_STYLES)

  return (
    <div className="px-4 md:px-5 py-3 border-b border-gray-100 bg-gray-50">
      <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
        Handwriting Style
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all ${
              selectedStyle === style.id
                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <span className="text-lg leading-none">
              {style.label.split(' ')[0]}
            </span>
            <span className={`text-xs font-medium whitespace-nowrap ${
              selectedStyle === style.id ? 'text-indigo-600' : 'text-gray-500'
            }`}>
              {style.label.split(' ').slice(1).join(' ')}
            </span>
            <span className="text-xs text-gray-300 whitespace-nowrap hidden md:block">
              {style.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default StylePicker
