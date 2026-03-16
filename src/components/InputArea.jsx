import { useState, useRef, useEffect } from 'react'
import './InputArea.css'

function InputArea({ onSendMessage, isLoading, onVoiceInput }) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('voice_enabled')
    return saved !== null ? saved === 'true' : true // Default to true
  })
  const textareaRef = useRef(null)
  const recognitionRef = useRef(null)

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true

      recognitionRef.current.onstart = () => {
        setIsRecording(true)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setMessage(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }
    }
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px'
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
    }
  }

  const toggleVoiceFeature = () => {
    const newValue = !voiceEnabled
    setVoiceEnabled(newValue)
    localStorage.setItem('voice_enabled', newValue)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="input-area">
      <div className="input-controls">
        <button
          className={`voice-toggle-btn ${voiceEnabled ? 'active' : ''}`}
          onClick={toggleVoiceFeature}
          title="Toggle voice feature"
        >
          🎙️
        </button>
      </div>
      
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
          placeholder="Ask about career paths, interviews, resume, salary, skills..."
          disabled={isLoading}
          rows="1"
        />
        
        {voiceEnabled && (
          <button
            onClick={handleVoiceToggle}
            className={`voice-input-btn ${isRecording ? 'recording' : ''}`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? '🔴' : '🎤'}
          </button>
        )}
        
        <button
          onClick={handleSend}
          className="send-btn"
          disabled={!message.trim() || isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default InputArea
