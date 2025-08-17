// server/lilyClient.js - Pluggable provider adapter for Lily
const axios = require('axios');

async function chatWithOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'default';
  const base = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';

  const resp = await axios.post(`${base}/chat/completions`, {
    model,
    messages,
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`, // LM Studio ignores it
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });

  const content = resp.data?.choices?.[0]?.message?.content || '...';
  return content;
}


async function chatWithWebhook(messages) {
  const url = process.env.LILY_API_URL;
  const key = process.env.LILY_API_KEY;
  if (!url) throw new Error('LILY_API_URL is required for LILY_PROVIDER=webhook');
  const resp = await axios.post(url, { messages }, {
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { 'Authorization': `Bearer ${key}` } : {})
    },
    timeout: 30000
  });
  // Expect { reply: string } or OpenAI-style response; normalize
  if (resp.data?.reply) return resp.data.reply;
  const content = resp.data?.choices?.[0]?.message?.content;
  return content || JSON.stringify(resp.data);
}

async function chatWithMock(messages) {
  const last = messages[messages.length - 1]?.content || '';
  return `🤖 (Mock Lily) You said: "${last}". Replace me by setting LILY_PROVIDER=openai or webhook in .env`;
}

async function chatWithLily(messages) {
  const provider = (process.env.LILY_PROVIDER || 'mock').toLowerCase();
  if (provider === 'openai') return chatWithOpenAI(messages);
  if (provider === 'webhook') return chatWithWebhook(messages);
  return chatWithMock(messages);
}

module.exports = { chatWithLily };
