import './QuickTemplates.css'

function QuickTemplates({ onSelectTemplate }) {
  const templates = [
    {
      emoji: '🎤',
      title: 'Interview Tips',
      prompt: 'What are the top 10 questions I should prepare for in my interview?'
    },
    {
      emoji: '📝',
      title: 'Resume Review',
      prompt: 'Help me improve my resume by highlighting key achievements and quantifiable results'
    },
    {
      emoji: '💼',
      title: 'Career Path',
      prompt: 'What career paths are available with my skills? How should I grow professionally?'
    },
    {
      emoji: '💰',
      title: 'Salary Talk',
      prompt: 'How do I negotiate a better salary for my next role?'
    },
    {
      emoji: '🚀',
      title: 'Quick Start',
      prompt: 'Tell me about your different coaching modes and how to use them'
    },
    {
      emoji: '🎓',
      title: 'Skill Building',
      prompt: 'What skills should I learn to advance my career in tech?'
    }
  ]

  return (
    <div className="quick-templates">
      <div className="templates-header">
        <h4>📌 Quick Start Templates</h4>
        <p>Click any template to begin</p>
      </div>
      <div className="templates-grid">
        {templates.map((template, idx) => (
          <button
            key={idx}
            className="template-card"
            onClick={() => onSelectTemplate(template.prompt)}
          >
            <div className="template-emoji">{template.emoji}</div>
            <div className="template-title">{template.title}</div>
            <div className="template-preview">{template.prompt.substring(0, 30)}...</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickTemplates
