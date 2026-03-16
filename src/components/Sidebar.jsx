import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ onSettingsClick, botMode, activeView, onViewChange, backendStatus }) {
  const navTabs = [
    { id: 'chat', label: 'AI Chat', icon: '💬', desc: 'Career guidance chat' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', desc: 'Charts & analytics' },
    { id: 'quiz', label: 'Career Quiz', icon: '🧩', desc: 'Find your path' },
    { id: 'resume', label: 'Resume', icon: '📄', desc: 'AI resume analysis' }
  ]

  const botModes = [
    { id: 'general', label: '💼 General Guidance', icon: '💼' },
    { id: 'interview', label: '🎤 Interview Prep', icon: '🎤' },
    { id: 'resume', label: '📄 Resume Builder', icon: '📄' },
    { id: 'salary', label: '💰 Salary Guide', icon: '💰' },
    { id: 'skills', label: '🎓 Skill Development', icon: '🎓' }
  ]

  const getStatusInfo = () => {
    switch (backendStatus) {
      case 'online':
        return { dot: 'active', text: '✓ Server Online', color: 'var(--success)' }
      case 'no-key':
        return { dot: 'warning', text: '⚠ API Key Missing', color: 'var(--warning)' }
      case 'offline':
        return { dot: '', text: '✗ Server Offline', color: 'var(--error)' }
      case 'checking':
      default:
        return { dot: 'checking', text: '⋯ Connecting...', color: 'var(--text-muted)' }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <aside className="sidebar">
      <div className="top-section">
        <div className="logo">
          <div className="logo-icon">💼</div>
          <div className="logo-text">CareerBot</div>
        </div>

        <button className="settings-btn" onClick={onSettingsClick} title="Settings">
          ⚙️
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeView === tab.id ? 'active' : ''}`}
            onClick={() => onViewChange(tab.id)}
            title={tab.desc}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            <div className="nav-tab-info">
              <span className="nav-tab-label">{tab.label}</span>
              <span className="nav-tab-desc">{tab.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="section">
        <div className="section-title">Current Mode</div>
        <div className="mode-display">
          {botModes.find(m => m.id === botMode)?.icon} {botModes.find(m => m.id === botMode)?.label}
        </div>
        <p className="mode-info">Change mode in settings to customize AI responses</p>
      </div>

      <div className="section">
        <div className="section-title">Server Status</div>
        <div className="key-status">
          <div className={`status-dot ${statusInfo.dot}`}></div>
          <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
        </div>
        {backendStatus === 'no-key' && (
          <p className="mode-info" style={{ color: 'var(--warning)', marginTop: '6px' }}>
            Set GEMINI_API_KEY in server/.env
          </p>
        )}
        {backendStatus === 'offline' && (
          <p className="mode-info" style={{ color: 'var(--error)', marginTop: '6px' }}>
            Run: cd server && node server.js
          </p>
        )}
      </div>

      <div className="section">
        <div className="section-title">Pro Tips</div>
        <div className="section-content">
          • <span className="highlight">Enter</span> to send<br />
          • <span className="highlight">Shift+Enter</span> for new line<br />
          • Copy & regenerate messages<br />
          • Export your chat history<br />
          • Dark/Light theme support
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
