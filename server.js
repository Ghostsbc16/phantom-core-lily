// server.js - Express backend for Lily
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { chatWithLily } = require('./server/lilyClient');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve static front-end
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, provider: process.env.LILY_PROVIDER || 'mock' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array of {role, content}' });
    }
    const reply = await chatWithLily(messages);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Lily failed to respond.' });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Lily server listening on http://localhost:${PORT}`);
});
