function Header({ assignmentsUsed, assignmentsLimit }) {
  const remaining = assignmentsLimit - assignmentsUsed
  const isEmpty = remaining <= 0

  return (
    <header className="bg-gray-900 text-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-md">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl md:text-2xl">✍️</span>
        <h1 className="text-lg md:text-xl font-bold tracking-tight">WriteAI</h1>
        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full hidden sm:inline">Beta</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Usage dots — hidden on very small screens, shown on sm+ */}
        <div className={`items-center gap-2 text-xs px-2 md:px-3 py-1.5 rounded-full hidden sm:flex ${
          isEmpty
            ? 'bg-red-900/40 text-red-300'
            : remaining === 1
            ? 'bg-amber-900/40 text-amber-300'
            : 'bg-gray-800 text-gray-300'
        }`}>
          <div className="flex gap-1">
            {Array.from({ length: assignmentsLimit }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                  i < assignmentsUsed ? 'bg-gray-600' : 'bg-indigo-400'
                }`}
              />
            ))}
          </div>
          <span className="hidden md:inline">
            {isEmpty ? 'No assignments left' : `${remaining} left`}
          </span>
        </div>

        {/* On mobile: just show count number */}
        <div className={`sm:hidden text-xs px-2 py-1 rounded-full ${
          isEmpty ? 'bg-red-900/40 text-red-300' : 'bg-gray-800 text-gray-300'
        }`}>
          {isEmpty ? '0 left' : `${remaining} left`}
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors whitespace-nowrap">
          <span className="hidden md:inline">Upgrade </span>₹99/mo
        </button>

      </div>
    </header>
  )
}

export default Header