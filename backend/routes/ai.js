const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many AI requests. Please try again in an hour.' },
});

// POST /api/ai/generate-bio
router.post('/generate-bio', authenticate, aiLimiter, async (req, res) => {
  try {
    const { skills, experience, jobTitle, tone = 'professional' } = req.body;

    if (!skills || !jobTitle) {
      return res.status(400).json({ error: 'Skills and job title are required' });
    }

    const toneInstructions = {
      professional: 'formal, confident, and results-oriented',
      creative: 'creative, engaging, and personality-driven',
      minimal: 'concise, direct, and impactful — no fluff',
    };

    const prompt = `Generate a professional portfolio bio for a ${jobTitle} with the following details:
    
Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}
Experience: ${experience || 'Not specified'}
Tone: ${toneInstructions[tone] || toneInstructions.professional}

Requirements:
- 2-3 paragraphs, 150-200 words total
- Start with a strong opening statement (no "Hello, I'm...")
- Highlight key technical skills naturally
- End with what the person is looking for or passionate about
- Make it feel human and authentic, not generic AI text
- Write in first person

Return only the bio text, no additional commentary.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.8,
    });

    const bio = completion.choices[0].message.content.trim();
    res.json({ bio });
  } catch (error) {
    console.error('OpenAI error:', error);
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ error: 'AI service temporarily unavailable' });
    }
    res.status(500).json({ error: 'Failed to generate bio' });
  }
});

module.exports = router;
