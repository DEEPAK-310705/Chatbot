import { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [animateSkills, setAnimateSkills] = useState(false)
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setAnimateSkills(true), 300)
    const t2 = setTimeout(() => setAnimateStats(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const careerCards = [
    {
      icon: '💻', title: 'Technology', color: '#00d4ff',
      desc: 'Software Development, AI/ML, Data Science, Cloud Computing',
      salary: '$75K — $180K', growth: 85, trend: '+22%'
    },
    {
      icon: '🏥', title: 'Healthcare', color: '#22c55e',
      desc: 'Nursing, Medical Research, Health Informatics, Biotech',
      salary: '$55K — $150K', growth: 78, trend: '+18%'
    },
    {
      icon: '💰', title: 'Finance', color: '#f59e0b',
      desc: 'Investment Banking, FinTech, Financial Analysis, Accounting',
      salary: '$65K — $200K', growth: 62, trend: '+12%'
    },
    {
      icon: '🎨', title: 'Creative & Design', color: '#ec4899',
      desc: 'UX/UI Design, Brand Strategy, Content Creation, Animation',
      salary: '$50K — $130K', growth: 70, trend: '+15%'
    },
    {
      icon: '📚', title: 'Education', color: '#7c3aed',
      desc: 'EdTech, Curriculum Design, Online Teaching, Training',
      salary: '$45K — $95K', growth: 55, trend: '+10%'
    },
    {
      icon: '📈', title: 'Business & Consulting', color: '#ef4444',
      desc: 'Management Consulting, Strategy, Operations, Entrepreneurship',
      salary: '$70K — $190K', growth: 68, trend: '+14%'
    }
  ]

  const skills = [
    { name: 'Communication', level: 78, color: '#22c55e' },
    { name: 'Technical Skills', level: 65, color: '#f59e0b' },
    { name: 'Leadership', level: 45, color: '#ef4444' },
    { name: 'Problem Solving', level: 82, color: '#22c55e' },
    { name: 'Creativity', level: 58, color: '#f59e0b' },
    { name: 'Adaptability', level: 72, color: '#22c55e' },
    { name: 'Teamwork', level: 88, color: '#22c55e' },
    { name: 'Time Management', level: 35, color: '#ef4444' }
  ]

  const marketData = [
    { label: 'AI/ML', value: 92, color: '#00d4ff' },
    { label: 'Cloud', value: 85, color: '#7c3aed' },
    { label: 'Cyber', value: 80, color: '#22c55e' },
    { label: 'Data', value: 78, color: '#f59e0b' },
    { label: 'DevOps', value: 75, color: '#ec4899' },
    { label: 'Mobile', value: 70, color: '#ef4444' },
    { label: 'Web3', value: 55, color: '#06b6d4' },
    { label: 'IoT', value: 60, color: '#8b5cf6' }
  ]

  const stats = [
    { label: 'Career Fields', value: '500+', icon: '🌐' },
    { label: 'Avg Salary Growth', value: '12%', icon: '📈' },
    { label: 'Skills Tracked', value: '200+', icon: '🎯' },
    { label: 'Success Rate', value: '94%', icon: '🏆' }
  ]

  const getSkillLabel = (level) => {
    if (level >= 70) return 'Strong'
    if (level >= 40) return 'Developing'
    return 'Needs Work'
  }

  return (
    <div className="dashboard">
      <div className="dashboard-scroll">
        {/* Header */}
        <div className="dash-header">
          <div className="dash-header-content">
            <h1>📊 Career Dashboard</h1>
            <p>Explore career fields, analyze your skills, and track market trends</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          {stats.map((stat, i) => (
            <div key={i} className={`stat-card ${animateStats ? 'animate' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Career Recommendation Cards */}
        <section className="dash-section">
          <div className="section-head">
            <h2>🚀 Career Recommendations</h2>
            <p>Top career fields with highest growth potential</p>
          </div>
          <div className="career-grid">
            {careerCards.map((card, i) => (
              <div key={i} className="career-card" style={{ '--card-color': card.color, animationDelay: `${i * 0.08}s` }}>
                <div className="career-card-header">
                  <span className="career-icon">{card.icon}</span>
                  <span className="career-trend" style={{ color: card.color }}>{card.trend}</span>
                </div>
                <h3>{card.title}</h3>
                <p className="career-desc">{card.desc}</p>
                <div className="career-salary">{card.salary}</div>
                <div className="career-growth">
                  <div className="growth-label">
                    <span>Growth Potential</span>
                    <span className="growth-pct">{card.growth}%</span>
                  </div>
                  <div className="growth-bar">
                    <div className="growth-fill" style={{ width: `${card.growth}%`, background: `linear-gradient(90deg, ${card.color}, ${card.color}88)` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Gap Analysis */}
        <section className="dash-section">
          <div className="section-head">
            <h2>🎯 Skill Gap Analysis</h2>
            <p>Identify strengths and areas for improvement</p>
          </div>
          <div className="skills-container">
            <div className="skills-grid">
              {skills.map((skill, i) => (
                <div key={i} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-meta">
                      <span className="skill-badge" style={{ color: skill.color, borderColor: `${skill.color}44`, background: `${skill.color}15` }}>
                        {getSkillLabel(skill.level)}
                      </span>
                      <span className="skill-pct">{skill.level}%</span>
                    </div>
                  </div>
                  <div className="skill-bar">
                    <div
                      className={`skill-fill ${animateSkills ? 'animate' : ''}`}
                      style={{
                        '--target-width': `${skill.level}%`,
                        background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                        boxShadow: `0 0 12px ${skill.color}44`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="skills-legend">
              <div className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }} /> Strong (70%+)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} /> Developing (40-69%)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> Needs Work (&lt;40%)</div>
            </div>
          </div>
        </section>

        {/* Job Market Trends Chart */}
        <section className="dash-section">
          <div className="section-head">
            <h2>📈 Job Market Trends 2026</h2>
            <p>Demand index by technology domain</p>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              {marketData.map((item, i) => (
                <div key={i} className="bar-group">
                  <div className="bar-value">{item.value}%</div>
                  <div className="bar-wrapper">
                    <div
                      className={`bar ${animateStats ? 'animate' : ''}`}
                      style={{
                        '--target-height': `${item.value}%`,
                        background: `linear-gradient(180deg, ${item.color}, ${item.color}66)`,
                        boxShadow: `0 0 16px ${item.color}33`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    />
                  </div>
                  <div className="bar-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
