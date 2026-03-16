import { useState } from 'react'
import './CareerQuiz.css'

function CareerQuiz({ onDiscussWithAI }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const questions = [
    {
      question: 'What type of work environment excites you most?',
      icon: '🏢',
      options: [
        { text: 'Fast-paced startup culture', icon: '🚀', tags: ['tech', 'business'] },
        { text: 'Structured corporate setting', icon: '🏛️', tags: ['finance', 'business'] },
        { text: 'Creative open studio', icon: '🎨', tags: ['creative', 'education'] },
        { text: 'Helping people directly', icon: '❤️', tags: ['healthcare', 'education'] }
      ]
    },
    {
      question: 'Which activity do you enjoy the most?',
      icon: '💡',
      options: [
        { text: 'Solving complex puzzles & coding', icon: '💻', tags: ['tech'] },
        { text: 'Analyzing data & making projections', icon: '📊', tags: ['finance', 'tech'] },
        { text: 'Designing and creating visual content', icon: '🎬', tags: ['creative'] },
        { text: 'Teaching and mentoring others', icon: '📚', tags: ['education', 'healthcare'] }
      ]
    },
    {
      question: 'What matters most in your career?',
      icon: '⭐',
      options: [
        { text: 'High salary & financial growth', icon: '💰', tags: ['finance', 'tech'] },
        { text: 'Work-life balance & flexibility', icon: '⚖️', tags: ['education', 'creative'] },
        { text: 'Making a meaningful impact', icon: '🌍', tags: ['healthcare', 'education'] },
        { text: 'Innovation & cutting-edge work', icon: '🔬', tags: ['tech', 'creative'] }
      ]
    },
    {
      question: 'How do you prefer to communicate?',
      icon: '💬',
      options: [
        { text: 'Writing detailed reports & docs', icon: '📝', tags: ['business', 'finance'] },
        { text: 'Presenting ideas to groups', icon: '🎤', tags: ['business', 'education'] },
        { text: 'Visual storytelling & demos', icon: '🖼️', tags: ['creative', 'tech'] },
        { text: 'One-on-one conversations', icon: '🤝', tags: ['healthcare', 'education'] }
      ]
    },
    {
      question: 'What is your ideal team size?',
      icon: '👥',
      options: [
        { text: 'Solo — I work best alone', icon: '🧑', tags: ['creative', 'tech'] },
        { text: 'Small team (2-5 people)', icon: '👫', tags: ['tech', 'creative'] },
        { text: 'Medium team (5-20 people)', icon: '👨‍👩‍👧‍👦', tags: ['business', 'healthcare'] },
        { text: 'Large organization (20+ people)', icon: '🏢', tags: ['finance', 'business'] }
      ]
    },
    {
      question: 'Which skill do you want to develop most?',
      icon: '🎯',
      options: [
        { text: 'Programming & AI', icon: '🤖', tags: ['tech'] },
        { text: 'Leadership & management', icon: '👑', tags: ['business', 'finance'] },
        { text: 'Artistic & design thinking', icon: '🎭', tags: ['creative'] },
        { text: 'Empathy & patient care', icon: '💝', tags: ['healthcare', 'education'] }
      ]
    },
    {
      question: 'How do you handle challenges?',
      icon: '💪',
      options: [
        { text: 'Break it down logically step by step', icon: '🧩', tags: ['tech', 'finance'] },
        { text: 'Brainstorm creative solutions', icon: '🌟', tags: ['creative', 'business'] },
        { text: 'Research best practices & data', icon: '📖', tags: ['finance', 'education'] },
        { text: 'Collaborate and seek diverse input', icon: '🤝', tags: ['healthcare', 'business'] }
      ]
    },
    {
      question: 'Where do you see yourself in 5 years?',
      icon: '🔮',
      options: [
        { text: 'Leading a tech team or startup', icon: '🦄', tags: ['tech', 'business'] },
        { text: 'Managing investments or a firm', icon: '🏦', tags: ['finance'] },
        { text: 'Running a creative agency or studio', icon: '🎬', tags: ['creative'] },
        { text: 'Making a difference in communities', icon: '🌱', tags: ['healthcare', 'education'] }
      ]
    }
  ]

  const careerProfiles = {
    tech: { name: 'Technology & Engineering', icon: '💻', color: '#00d4ff', desc: 'Software Development, AI/ML, Data Science' },
    finance: { name: 'Finance & Analytics', icon: '💰', color: '#f59e0b', desc: 'Investment, FinTech, Financial Analysis' },
    creative: { name: 'Creative & Design', icon: '🎨', color: '#ec4899', desc: 'UX/UI Design, Content Creation, Branding' },
    healthcare: { name: 'Healthcare & Wellness', icon: '🏥', color: '#22c55e', desc: 'Medical, Biotech, Health Informatics' },
    education: { name: 'Education & Training', icon: '📚', color: '#7c3aed', desc: 'Teaching, EdTech, Curriculum Design' },
    business: { name: 'Business & Consulting', icon: '📈', color: '#ef4444', desc: 'Management, Strategy, Consulting' }
  }

  const handleSelect = (optionIdx) => {
    setSelectedOption(optionIdx)
    setTimeout(() => {
      const newAnswers = [...answers, questions[currentQ].options[optionIdx].tags]
      setAnswers(newAnswers)
      setSelectedOption(null)

      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1)
      } else {
        setShowResults(true)
      }
    }, 400)
  }

  const getResults = () => {
    const tagCount = {}
    answers.flat().forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })

    const total = answers.flat().length
    const sorted = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag, count]) => ({
        ...careerProfiles[tag],
        percentage: Math.round((count / total) * 100),
        tag
      }))

    return sorted
  }

  const resetQuiz = () => {
    setCurrentQ(0)
    setAnswers([])
    setShowResults(false)
    setSelectedOption(null)
  }

  const handleDiscuss = () => {
    const results = getResults()
    const msg = `Based on my career quiz results, my top career matches are:\n${results.map((r, i) => `${i + 1}. ${r.name} (${r.percentage}% match) - ${r.desc}`).join('\n')}\n\nCan you give me detailed advice on pursuing these career paths, including required skills, certifications, and next steps?`
    if (onDiscussWithAI) onDiscussWithAI(msg)
  }

  if (showResults) {
    const results = getResults()
    return (
      <div className="career-quiz">
        <div className="quiz-scroll">
          <div className="quiz-results">
            <div className="results-header">
              <div className="results-icon">🎉</div>
              <h2>Your Career Match Results</h2>
              <p>Based on your answers, here are your top career matches</p>
            </div>

            <div className="results-cards">
              {results.map((result, i) => (
                <div key={i} className="result-card" style={{ '--result-color': result.color, animationDelay: `${i * 0.15}s` }}>
                  <div className="result-rank">#{i + 1}</div>
                  <div className="result-gauge">
                    <svg viewBox="0 0 120 120" className="gauge-svg">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-hover)" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={result.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${result.percentage * 3.14} 314`}
                        transform="rotate(-90 60 60)"
                        className="gauge-progress"
                      />
                    </svg>
                    <div className="gauge-text">
                      <span className="gauge-pct">{result.percentage}%</span>
                      <span className="gauge-label">Match</span>
                    </div>
                  </div>
                  <div className="result-icon">{result.icon}</div>
                  <h3>{result.name}</h3>
                  <p>{result.desc}</p>
                </div>
              ))}
            </div>

            <div className="results-actions">
              <button className="discuss-btn" onClick={handleDiscuss}>
                💬 Discuss with AI Coach
              </button>
              <button className="retake-btn" onClick={resetQuiz}>
                🔄 Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((currentQ) / questions.length) * 100
  const q = questions[currentQ]

  return (
    <div className="career-quiz">
      <div className="quiz-scroll">
        <div className="quiz-header">
          <h1>🧩 Career Discovery Quiz</h1>
          <p>Answer 8 questions to find your ideal career path</p>
        </div>

        <div className="quiz-progress-section">
          <div className="quiz-progress-info">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="quiz-question-card" key={currentQ}>
          <div className="question-icon">{q.icon}</div>
          <h2 className="question-text">{q.question}</h2>

          <div className="options-grid">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`option-card ${selectedOption === i ? 'selected' : ''}`}
                onClick={() => handleSelect(i)}
                disabled={selectedOption !== null}
              >
                <span className="option-icon">{opt.icon}</span>
                <span className="option-text">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerQuiz
