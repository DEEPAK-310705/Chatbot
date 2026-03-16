import { useState, useEffect } from 'react'
import './Message.css'

function Message({ role, content, timestamp, selectedVoice, onCopy, onRegenerate }) {
  const [showActions, setShowActions] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('voice_enabled')
    return saved !== null ? saved === 'true' : true // Default to true
  })
  const [availableVoices, setAvailableVoices] = useState([])

  // Load voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setAvailableVoices(voices)
      }
    }

    // Load voices immediately and also listen for voiceschanged event
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    const checkVoiceEnabled = () => {
      setVoiceEnabled(localStorage.getItem('voice_enabled') === 'true')
    }
    window.addEventListener('storage', checkVoiceEnabled)
    return () => window.removeEventListener('storage', checkVoiceEnabled)
  }, [])

  // Format message content (markdown-like)
  const formatContent = (text) => {
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Code blocks
    formatted = formatted.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Headers
    formatted = formatted.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    formatted = formatted.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    formatted = formatted.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br />')

    return formatted
  }

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(content)
    utterance.rate = 0.95
    utterance.pitch = selectedVoice === 'male' ? 0.7 : 1.2
    utterance.volume = 1

    // Select voice based on selectedVoice
    if (availableVoices.length > 0) {
      let selectedVoiceObj = null

      if (selectedVoice === 'female-indian' || selectedVoice === 'female') {
        // Prefer female voices with various name patterns
        selectedVoiceObj = availableVoices.find(v => v.name.toLowerCase().includes('woman')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('female')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('samantha')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('victoria')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('moira')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('karen')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('zira')) ||
                          availableVoices[0]
      } else if (selectedVoice === 'male') {
        // Prefer male voices
        selectedVoiceObj = availableVoices.find(v => v.name.toLowerCase().includes('man')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('male')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('alex')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('bruce')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('david')) ||
                          availableVoices.find(v => v.name.toLowerCase().includes('mark')) ||
                          availableVoices[0]
      } else {
        selectedVoiceObj = availableVoices[0]
      }

      if (selectedVoiceObj) {
        utterance.voice = selectedVoiceObj
      }
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (e) => {
      console.error('Speech error:', e)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  return (
    <div 
      className={`message ${role}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="avatar">
        {role === 'user' ? '👤' : '💼'}
      </div>
      <div className="message-content">
        <div className="bubble">
          <div
            className="bubble-text"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />
        </div>
        {timestamp && (
          <div className="message-time">{formatTime(timestamp)}</div>
        )}
      </div>
      
      {showActions && (
        <div className="message-actions">
          {onCopy && (
            <button 
              className="action-btn copy-btn" 
              onClick={onCopy}
              title="Copy message"
            >
              📋
            </button>
          )}
          {role === 'bot' && voiceEnabled && (
            <button
              className={`action-btn speak-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={handleSpeak}
              title={isSpeaking ? 'Stop speaking' : 'Speak response'}
            >
              {isSpeaking ? '🔊' : '🔇'}
            </button>
          )}
          {onRegenerate && (
            <button 
              className="action-btn regenerate-btn" 
              onClick={onRegenerate}
              title="Regenerate response"
            >
              🔄
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Message
