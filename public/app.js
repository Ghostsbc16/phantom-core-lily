// public/app.js - Frontend chat logic
const chatEl = document.getElementById('chat');
const form = document.getElementById('chatForm');
const input = document.getElementById('userInput');
const suggestions = document.getElementById('suggestions');
const themeToggle = document.getElementById('themeToggle');
document.getElementById('year').textContent = new Date().getFullYear();

const store = {
  messages: [
    { role: 'system', content: 'You are Lily: playful, helpful, concise, and kind.You were made by Phantom core™ which is a company owned by Ghost ' }
  ]
};

function bubble(role, html) {
  const wrap = document.createElement('div');
  wrap.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';
  const msg = document.createElement('div');
  msg.className = [
    'max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-wrap',
    role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'
  ].join(' ');
  msg.innerHTML = html;
  wrap.appendChild(msg);
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function typingIndicator(show=true) {
  let el = document.getElementById('typing');
  if (show) {
    if (!el) {
      el = document.createElement('div');
      el.id = 'typing';
      el.className = 'flex items-center gap-2 text-slate-500 text-sm';
      el.innerHTML = '<span class="animate-pulse">Lily is thinking…</span>';
      chatEl.appendChild(el);
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  } else {
    if (el) el.remove();
  }
}

function easterEgg(input) {
  const s = input.trim().toLowerCase();
  if (s === 'konami') return '🕹️ Secret unlocked: up up down down left right left right B A!';
  if (s.includes('make me laugh')) return 'Here’s a quick one: Why did the developer go broke? Because they used up all their cache.';
  return null;
}

async function send(message) {
  if (!message) return;
  const egg = easterEgg(message);
  bubble('user', message);
  input.value = '';
  input.focus();

  if (egg) {
    bubble('assistant', egg);
    return;
  }

  typingIndicator(true);
  form.querySelector('button').disabled = true;

  try {
    store.messages.push({ role: 'user', content: message });
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: store.messages })
    });
    const data = await res.json();
    const reply = data.reply || 'Sorry, I had trouble responding.';
    store.messages.push({ role: 'assistant', content: reply });
    typingIndicator(false);
    bubble('assistant', reply.replace(/\n/g, '<br>'));
  } catch (err) {
    typingIndicator(false);
    bubble('assistant', '⚠️ Oops, something went wrong talking to my brain.');
  } finally {
    form.querySelector('button').disabled = false;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  send(input.value);
});

suggestions.querySelectorAll('.sugg').forEach(btn => {
  btn.className = 'sugg px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition';
  btn.addEventListener('click', () => send(btn.textContent));
});

// theme toggle
function setTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
themeToggle.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
setTheme(localStorage.getItem('theme') === 'dark');
