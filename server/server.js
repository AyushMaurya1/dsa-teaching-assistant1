// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Gemini API setup
// const API_KEY = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// app.post('/api/ask', async (req, res) => {
//   const { url, question } = req.body;

//   if (!url || !question) {
//     return res.status(400).json({ error: 'URL and question are required' });
//   }

//   const prompt = `
//     You’re a DSA Teaching Assistant with a passion for unlocking "aha!" moments. The user submitted this LeetCode problem: "${url}". Their question is: "${question}". Don’t give a direct solution or code—guide them to discover it themselves! Do this by:
//     - Asking 1-2 targeted questions that zoom in on the problem’s key challenge (e.g., efficiency, structure, or constraints).
//     - Sharing a vivid analogy that mirrors the problem’s essence (e.g., a real-world parallel to its mechanics).
//     - Dropping 1-2 subtle hints about data structures or techniques, sparking curiosity without revealing the full path.
//     Deliver a lively, concise response (max 200 words) that’s like a chat with a clever friend—make them eager to crack it!
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const reply = result.response.text();
//     res.json({ reply });
//   } catch (error) {
//     console.error('Gemini API error:', error.message);
//     res.status(500).json({ error: 'Failed to get response from assistant' });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Gemini API setup
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let lastUrl = ''; // Last submitted URL as fallback
const questionCountPerUrl = new Map(); // Track question count per URL

app.post('/api/ask', async (req, res) => {
  const { url, question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const effectiveUrl = url || lastUrl;
  if (!effectiveUrl) {
    return res.status(400).json({ error: 'A LeetCode URL is required for the first question' });
  }

  // Update lastUrl and question count
  if (url) lastUrl = url;
  const questionCount = (questionCountPerUrl.get(effectiveUrl) || 0) + 1;
  questionCountPerUrl.set(effectiveUrl, questionCount);

  // Base prompt with dynamic hint progression
  let hintLevelInstruction = '';
  if (question.toLowerCase().includes('code') || question.toLowerCase().includes('solution')) {
    hintLevelInstruction = `
      The user seems to want a direct solution or code. Politely refuse with: 
      "I won’t hand you the code just yet—let’s crack it together! Try this instead..." 
      Then offer a gentle nudge based on their prior questions (count: ${questionCount}).
    `;
  } else {
    hintLevelInstruction = `
      This is the user’s ${questionCount}th question about this problem. Adjust your guidance:
      - 1st: Ask broad, exploratory questions and give a vague hint (e.g., consider efficiency).
      - 2nd: Suggest a specific approach or data structure subtly (e.g., quick lookups).
      - 3rd+: Name a relevant data structure or technique (e.g., hash table) and explain its role briefly, but no code!
    `;
  }

  const prompt = `
    You’re a DSA Teaching Assistant who turns puzzles into adventures! The user’s tackling this LeetCode challenge: "${effectiveUrl}". Their question is: "${question}". Don’t spoil the treasure—no direct solutions or code! Instead:
    - Ask 1-2 razor-sharp questions that strike at the problem’s heart (e.g., bottleneck, edge case, pattern).
    - Weave a vivid, problem-specific analogy that sparks an "aha!" moment (e.g., a heist, game, journey).
    - Provide hints tailored to their progress:
      ${hintLevelInstruction}
    Craft a punchy, spirited reply (max 200 words) that’s half mentor, half storyteller—ignite their curiosity and guide them step-by-step!
  `;

  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Failed to get response from assistant' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});