function Header({ assignmentsUsed, assignmentsLimit }) {
  const remaining = assignmentsLimit - assignmentsUsed
  const isEmpty = remaining <= 0

  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">✍️</span>
        <h1 className="text-xl font-bold tracking-tight">WriteAI</h1>
        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Beta</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Usage counter badge */}
        <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full ${
          isEmpty
            ? 'bg-red-900/40 text-red-300'
            : remaining === 1
            ? 'bg-amber-900/40 text-amber-300'
            : 'bg-gray-800 text-gray-300'
        }`}>
          {/* Little dots showing usage */}
          <div className="flex gap-1">
            {Array.from({ length: assignmentsLimit }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < assignmentsUsed ? 'bg-gray-600' : 'bg-indigo-400'
                }`}
              />
            ))}
          </div>
          <span>
            {isEmpty ? 'No assignments left' : `${remaining} free ${remaining === 1 ? 'assignment' : 'assignments'} left`}
          </span>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          Upgrade ₹99/mo
        </button>
      </div>
    </header>
  )
}

export default Header