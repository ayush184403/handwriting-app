import { useState, useEffect } from 'react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import PreviewPanel from './components/PreviewPanel'
import UpgradeModal from './components/UpgradeModal'
import MobileTabs from './components/MobileTabs'
import { rewriteAsStudent } from './services/gemini'
import { getUsage, incrementUsage, saveAssignment, canGenerate } from './services/supabase'

function App() {
  const [text, setText] = useState('')
  const [rewrittenText, setRewrittenText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [subject, setSubject] = useState('General')
  const [selectedStyle, setSelectedStyle] = useState('neat')
  const [assignmentsUsed, setAssignmentsUsed] = useState(0)
  const [assignmentsLimit, setAssignmentsLimit] = useState(3)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [activeTab, setActiveTab] = useState('input')

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
    const allowed = await canGenerate()
    if (!allowed) {
      setShowUpgradeModal(true)
      return
    }
    setIsLoading(true)
    setError('')
    setActiveTab('preview')
    try {
      const result = await rewriteAsStudent(text, subject)
      setRewrittenText(result)
      const updatedUsage = await incrementUsage()
      setAssignmentsUsed(updatedUsage.assignments_used)
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
      <MobileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasOutput={!!rewrittenText}
      />
      <main className="flex flex-1 overflow-hidden">
        <div className={`flex flex-col overflow-hidden w-full md:w-1/2 ${activeTab === 'input' ? 'flex' : 'hidden'} md:flex`}>
          <InputPanel
            text={text}
            setText={setText}
            subject={subject}
            setSubject={setSubject}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            assignmentsUsed={assignmentsUsed}
            assignmentsLimit={assignmentsLimit}
          />
        </div>
        <div className={`flex flex-col overflow-hidden w-full md:w-1/2 ${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex`}>
          <PreviewPanel
            text={text}
            rewrittenText={rewrittenText}
            isLoading={isLoading}
            error={error}
            selectedStyle={selectedStyle}
          />
        </div>
      </main>
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  )
}

export default App