const API_BASE_URL = 'http://localhost:5000'; // Backend server URL

let currentAudio = null;

function updateReplayButtonState(isPlaying) {
  const btn = document.getElementById('replay-btn');
  if (!btn) return;

  if (isPlaying) {
    btn.classList.add('playing');
    btn.innerHTML = '⏹ Stop';
  } else {
    btn.classList.remove('playing');
    btn.innerHTML = '🔊 Replay';
  }
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    updateReplayButtonState(false);
  }
}

function updateMainButtonState() {
  const btn = document.getElementById('main-action-btn');
  const resultArea = document.getElementById('result-area');
  const form = document.getElementById('translate-form');
  if (!btn || !resultArea || !form) return;

  const isResultVisible = resultArea.style.display === 'block';

  if (isResultVisible) {
    btn.textContent = 'Clear';
    btn.className = 'btn-clear';
    btn.type = 'button'; // Prevent form submission when clearing
    btn.onclick = handleClear;
  } else {
    btn.textContent = 'Translate & Play';
    btn.className = 'btn';
    btn.type = 'submit';
    btn.onclick = null; // Let the form onsubmit handle it
  }
}

async function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    toggleView('main');
  } else {
    toggleView('login');
  }
}

function toggleView(view) {
  document.body.setAttribute('data-view', view);
  const authForm = document.getElementById('auth-form');
  if (authForm) authForm.reset();

  if (view === 'main') {
    const input = document.getElementById('thai-input');
    if (input) {
      const savedInput = localStorage.getItem('lastInput');
      if (savedInput) input.value = savedInput;
      input.focus();
    }

    // Load saved translation if exists
    const savedText = localStorage.getItem('lastText');
    const savedSound = localStorage.getItem('lastSound');
    if (savedText && savedSound) {
      const resultArea = document.getElementById('result-area');
      const ipaResult = document.getElementById('ipa-result');
      resultArea.style.display = 'block';
      ipaResult.textContent = savedText;
    }
    updateMainButtonState();
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}

async function handleSubmit(event) {
  event.preventDefault();
  const view = document.body.getAttribute('data-view');
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  const endpoint = view === 'login' ? '/users/login' : '/users/register';

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      if (view === 'login') {
        localStorage.setItem('token', result.token);
        toggleView('main');
        showToast('Logged in successfully!', 'success');
      } else {
        showToast('Registration successful! Please log in.', 'success');
        toggleView('login');
      }
    } else {
      showToast(result.message || 'An error occurred', 'error');
    }
  } catch (error) {
    console.error('Auth error:', error);
    showToast('Failed to connect to server', 'error');
  }
}

function handleLogout() {
  stopCurrentAudio();
  localStorage.removeItem('token');
  localStorage.removeItem('lastInput');
  localStorage.removeItem('lastText');
  localStorage.removeItem('lastSound');
  toggleView('login');
  showToast('Logged out successfully');
}

async function handleTranslate() {
  const text = document.getElementById('thai-input').value;
  if (!text) return;

  const btn = document.getElementById('main-action-btn');
  const resultArea = document.getElementById('result-area');
  const ipaResult = document.getElementById('ipa-result');

  btn.disabled = true;
  btn.textContent = 'Translating...';

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    const result = await response.json();

    if (response.ok) {
      resultArea.style.display = 'block';
      ipaResult.textContent = result.text;

      // Save to local storage for persistence
      localStorage.setItem('lastInput', text);
      
      if (result.sound) {
        localStorage.setItem('lastText', result.text);
        localStorage.setItem('lastSound', result.sound);

        stopCurrentAudio();
        currentAudio = new Audio(`data:audio/mpeg;base64,${result.sound}`);
        currentAudio.onended = () => updateReplayButtonState(false);
        updateReplayButtonState(true);
        currentAudio.play().catch(e => {
          console.error('Audio play error:', e);
          updateReplayButtonState(false);
        });
      }
      updateMainButtonState();
    } else {
      if (response.status === 401) {
        showToast('Session expired. Please log in again.', 'error');
        handleLogout();
      } else {
        showToast(result.message || 'Translation failed', 'error');
        updateMainButtonState();
      }
    }
  } catch (error) {
    console.error('Translate error:', error);
    showToast('Failed to connect to server', 'error');
    updateMainButtonState();
  } finally {
    btn.disabled = false;
  }
}

function handleReplay() {
  const sound = localStorage.getItem('lastSound');
  if (!sound) {
    showToast('No saved sound to play', 'error');
    return;
  }

  if (currentAudio && !currentAudio.paused) {
    stopCurrentAudio();
    return;
  }

  stopCurrentAudio();
  currentAudio = new Audio(`data:audio/mpeg;base64,${sound}`);
  currentAudio.onended = () => updateReplayButtonState(false);
  updateReplayButtonState(true);
  currentAudio.play().catch(e => {
    console.error('Audio play error:', e);
    updateReplayButtonState(false);
  });
}

function handleClear() {
  stopCurrentAudio();
  document.getElementById('thai-input').value = '';
  document.getElementById('result-area').style.display = 'none';
  document.getElementById('ipa-result').textContent = '';
  localStorage.removeItem('lastInput');
  localStorage.removeItem('lastText');
  localStorage.removeItem('lastSound');
  updateMainButtonState();
  document.getElementById('thai-input').focus();
}

// Initial check
checkAuth();

// Global scope attachment for the inline onclick handlers
window.toggleView = toggleView;
window.handleSubmit = handleSubmit;
window.handleLogout = handleLogout;
window.handleTranslate = handleTranslate;
window.handleReplay = handleReplay;
window.handleClear = handleClear;
