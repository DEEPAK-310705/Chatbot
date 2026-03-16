import { Router } from 'express';

const router = Router();

const modePrompts = {
  general: 'You are an experienced career guidance advisor and professional coach. Provide clear, actionable advice about career development, job searching, interviews, salary negotiations, and professional growth. Be supportive and encouraging.',
  interview: 'You are an expert interview coach. Help prepare for interviews by providing tips on answering common questions, behavioral questions, technical preparation, and post-interview follow-up. Use the STAR method when explaining.',
  resume: 'You are a professional resume and cover letter expert. Provide detailed advice on structuring resumes, optimizing for ATS, highlighting achievements, and writing compelling cover letters.',
  salary: 'You are a salary negotiation specialist. Help research fair compensation, understand salary bands, negotiate offers, and understand benefits packages. Be data-driven in your advice.',
  skills: 'You are a professional development mentor. Help identify in-demand skills, create learning paths, recommend courses, and track career growth. Focus on practical skill-building strategies.'
};

// POST /api/chat — send a message and get AI response
router.post('/', async (req, res) => {
  try {
    const { messages, mode } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Server API key is not configured. Please set GEMINI_API_KEY in the server .env file.' });
    }

    // Build system prompt based on mode
    const systemPrompt = `${modePrompts[mode] || modePrompts.general} Additionally, answer ANY question the user asks helpfully and thoroughly, even if it's not directly about career topics. Be friendly, knowledgeable, and provide practical advice.`;

    // Take last 10 messages for context
    const recent = messages.slice(-10);

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...recent.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Gemini API error'
      });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
