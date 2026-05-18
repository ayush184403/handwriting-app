import { useState, useEffect } from 'react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import PreviewPanel from './components/PreviewPanel'
import UpgradeModal from './components/UpgradeModal'
import { rewriteAsStudent } from './services/gemini'
import { getUsage, incrementUsage, saveAssignment, canGenerate } from './services/supabase'

function App() {
  const [text, setText] = useState('')
  const [rewrittenText, setRewrittenText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [subject, setSubject] = useState('General')

  // Usage tracking state
  const [assignmentsUsed, setAssignmentsUsed] = useState(0)
  const [assignmentsLimit, setAssignmentsLimit] = useState(3)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Load usage from Supabase when app first opens
  useEffect(() => {
    async function loadUsage() {
      try {
        const usage = await getUsage()
        setAssignmentsUsed(usage.assignments_used)
        setAssignmentsLimit(usage.assignments_limit)
      } catch (err) {
        console.error('Could not load usage:', err)
      }
    }
    loadUsage()
  }, [])

  async function handleGenerate() {
    if (!text.trim()) return

    // Check if user has assignments left
    const allowed = await canGenerate()
    if (!allowed) {
      setShowUpgradeModal(true)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 1. Rewrite with Gemini
      const result = await rewriteAsStudent(text, subject)
      setRewrittenText(result)

      // 2. Increment usage counter in Supabase
      const updatedUsage = await incrementUsage()
      setAssignmentsUsed(updatedUsage.assignments_used)

      // 3. Save assignment to database
      await saveAssignment(text, result, subject)

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      <Header
        assignmentsUsed={assignmentsUsed}
        assignmentsLimit={assignmentsLimit}
      />

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col overflow-hidden">
          <InputPanel
            text={text}
            setText={setText}
            subject={subject}
            setSubject={setSubject}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            assignmentsUsed={assignmentsUsed}
            assignmentsLimit={assignmentsLimit}
          />
        </div>
        <div className="w-1/2 flex flex-col overflow-hidden">
          <PreviewPanel
            text={text}
            rewrittenText={rewrittenText}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>

      {/* Upgrade modal — shown when limit is hit */}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}

    </div>
  )
}

export default App