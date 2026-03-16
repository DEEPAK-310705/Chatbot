import { useState, useEffect, useRef } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Settings from './components/Settings'
import Dashboard from './components/Dashboard'
import CareerQuiz from './components/CareerQuiz'
import ResumeAnalyzer from './components/ResumeAnalyzer'

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('dark')
  const [showSettings, setShowSettings] = useState(false)
  const [botMode, setBotMode] = useState('general')
  const [activeView, setActiveView] = useState('chat')
  const [backendStatus, setBackendStatus] = useState('checking') // 'online' | 'offline' | 'checking' | 'no-key'
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('voice_enabled')
    return saved !== null ? saved === 'true' : true
  })
  const [selectedVoice, setSelectedVoice] = useState(localStorage.getItem('selected_voice') || 'female-indian')
  const messagesEndRef = useRef(null)

  // Check backend health on mount and periodically
  useEffect(() => {
    checkBackendHealth()
    const interval = setInterval(checkBackendHealth, 30000) // check every 30s
    return () => clearInterval(interval)
  }, [])

  const checkBackendHealth = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      if (data.status === 'ok') {
        setBackendStatus(data.apiKeyConfigured ? 'online' : 'no-key')
      } else {
        setBackendStatus('offline')
      }
    } catch {
      setBackendStatus('offline')
    }
  }

  // Load chat history and theme on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('career_chat_history')
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory))
    }

    const savedTheme = localStorage.getItem('chatbot_theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }

    const savedMode = localStorage.getItem('chatbot_mode')
    if (savedMode) {
      setBotMode(savedMode)
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Save voice enabled state to localStorage
  useEffect(() => {
    localStorage.setItem('voice_enabled', voiceEnabled)
  }, [voiceEnabled])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('chatbot_theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const changeBotMode = (mode) => {
    setBotMode(mode)
    localStorage.setItem('chatbot_mode', mode)
  }

  const changeVoice = (voice) => {
    setSelectedVoice(voice)
    localStorage.setItem('selected_voice', voice)
  }

  const saveChatHistory = (newMessages) => {
    localStorage.setItem('career_chat_history', JSON.stringify(newMessages))
  }

  const clearChatHistory = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      setMessages([])
      localStorage.removeItem('career_chat_history')
      setError('')
    }
  }

  const exportChat = (format = 'txt') => {
    if (messages.length === 0) {
      setError('No messages to export')
      return
    }

    let content = 'Career Guidance Chatbot - Conversation Export\n'
    content += `Date: ${new Date().toLocaleString()}\n`
    content += `Mode: ${botMode.toUpperCase()}\n`
    content += '='.repeat(50) + '\n\n'

    messages.forEach((msg) => {
      content += `${msg.role.toUpperCase()}: ${msg.content}\n\n`
    })

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career-chat-${Date.now()}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const sendMessage = async (userMessage) => {
    if (backendStatus !== 'online') {
      setError(backendStatus === 'no-key'
        ? 'The server API key is not configured. Please set GEMINI_API_KEY in the server .env file.'
        : 'Backend server is offline. Please make sure the server is running.')
      return
    }

    if (!userMessage.trim()) return

    setError('')
    setIsLoading(true)

    // Switch to chat view when sending a message
    setActiveView('chat')

    const newMessages = [...messages, { role: 'user', content: userMessage, timestamp: new Date(), voice: selectedVoice }]
    setMessages(newMessages)
    saveChatHistory(newMessages)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mode: botMode
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Server error')
      }

      const updatedMessages = [...newMessages, { role: 'bot', content: data.reply, timestamp: new Date(), voice: selectedVoice }]
      setMessages(updatedMessages)
      saveChatHistory(updatedMessages)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const regenerateLastMessage = async () => {
    if (messages.length < 2) return

    const lastUserMessageIdx = [...messages].reverse().findIndex(m => m.role === 'user')
    if (lastUserMessageIdx === -1) return

    const actualIdx = messages.length - 1 - lastUserMessageIdx
    const userMessage = messages[actualIdx].content

    const truncatedMessages = messages.slice(0, actualIdx + 1)
    setMessages(truncatedMessages)
    saveChatHistory(truncatedMessages)

    await sendMessage(userMessage)
  }

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content)
    alert('Message copied to clipboard!')
  }

  const handleQuizDiscuss = (msg) => {
    setActiveView('chat')
    sendMessage(msg)
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'quiz':
        return <CareerQuiz onDiscussWithAI={handleQuizDiscuss} />
      case 'resume':
        return <ResumeAnalyzer />
      case 'chat':
      default:
        return (
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={sendMessage}
            onDismissError={() => setError('')}
            messagesEndRef={messagesEndRef}
            onCopyMessage={copyMessage}
            onRegenerateMessage={regenerateLastMessage}
            hasMessages={messages.length > 0}
            theme={theme}
            selectedVoice={selectedVoice}
          />
        )
    }
  }

  return (
    <div className="app" data-theme={theme}>
      {showSettings && (
        <Settings
          theme={theme}
          botMode={botMode}
          selectedVoice={selectedVoice}
          onThemeChange={toggleTheme}
          onModeChange={changeBotMode}
          onVoiceChange={changeVoice}
          onClose={() => setShowSettings(false)}
          onClearHistory={clearChatHistory}
          onExport={exportChat}
        />
      )}
      <div className="container">
        <Sidebar
          onSettingsClick={() => setShowSettings(true)}
          botMode={botMode}
          activeView={activeView}
          onViewChange={setActiveView}
          backendStatus={backendStatus}
        />
        {renderActiveView()}
      </div>
    </div>
  )
}

export default App
