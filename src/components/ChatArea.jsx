import Message from './Message'
import InputArea from './InputArea'
import QuickTemplates from './QuickTemplates'
import './ChatArea.css'

function ChatArea({ messages, isLoading, error, selectedVoice, onSendMessage, onDismissError, messagesEndRef, onCopyMessage, onRegenerateMessage, hasMessages, theme }) {
  const isEmpty = messages.length === 0

  return (
    <main className="chat-area">
      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <span>{error}</span>
          <button className="close-error" onClick={onDismissError}>×</button>
        </div>
      )}

      <header className="chat-header">
        <span>💬</span>
        <h2>Career Guidance Chat</h2>
        <span>•</span>
        <span>Ask anything about your professional journey</span>
      </header>

      <div className="messages-container">
        <div className="messages">
          {isEmpty && (
            <div className="empty-state">
              <div className="empty-hero">
                <div className="hero-glow" />
                <div className="hero-icon">🚀</div>
                <div className="hero-particles">
                  <span className="particle">✨</span>
                  <span className="particle">💡</span>
                  <span className="particle">🎯</span>
                  <span className="particle">⭐</span>
                </div>
              </div>
              <h3>Welcome to Your AI Career Coach</h3>
              <p>Get personalized career guidance, interview prep, resume tips, salary insights, and skill development plans.</p>
              <div className="feature-chips">
                <div className="chip">🎤 Interview Prep</div>
                <div className="chip">📄 Resume Builder</div>
                <div className="chip">💰 Salary Guide</div>
                <div className="chip">🎓 Skills Mentor</div>
                <div className="chip">🎙️ Voice Input</div>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <Message 
              key={idx} 
              role={msg.role} 
              content={msg.content}
              timestamp={msg.timestamp}
              selectedVoice={selectedVoice}
              onCopy={() => onCopyMessage(msg.content)}
              onRegenerate={msg.role === 'bot' && idx === messages.length - 1 ? onRegenerateMessage : null}
            />
          ))}

          {isLoading && (
            <div className="message bot">
              <div className="avatar">💼</div>
              <div className="bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {isEmpty && <QuickTemplates onSelectTemplate={onSendMessage} />}

      <InputArea onSendMessage={onSendMessage} isLoading={isLoading} />
    </main>
  )
}

export default ChatArea
