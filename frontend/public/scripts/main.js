import { CONFIG } from './config.js';
import * as api from './api.js';
import * as ui from './ui.js';
import { showToast } from './toast.js';

let currentAudio = null;

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    ui.updateReplayButtonState(false);
  }
}

async function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    ui.toggleView('main');
  } else {
    ui.toggleView('login');
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const view = document.body.getAttribute('data-view');
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    if (view === 'login') {
      const result = await api.login(data);
      localStorage.setItem('token', result.token);
      ui.toggleView('main');
      showToast('Logged in successfully!', 'success');
    } else {
      await api.register(data);
      showToast('Registration successful! Please log in.', 'success');
      ui.toggleView('login');
    }
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message, 'error');
    }
  }
}

function handleLogout() {
  stopCurrentAudio();
  localStorage.removeItem('token');
  localStorage.removeItem('lastInput');
  localStorage.removeItem('lastText');
  localStorage.removeItem('lastSound');
  ui.toggleView('login');
  showToast('Logged out successfully');
}

async function handleTranslate() {
  const input = document.getElementById('thai-input');
  const text = input.value; // Basic required validation handled by HTML5

  const btn = document.getElementById('main-action-btn');
  const resultArea = document.getElementById('result-area');
  const ipaResult = document.getElementById('ipa-result');

  btn.disabled = true;
  btn.textContent = 'Translating...';

  try {
    const result = await api.translate(text);
    
    resultArea.style.display = 'block';
    ipaResult.textContent = result.text;
    localStorage.setItem('lastInput', text);
    
    if (result.sound) {
      localStorage.setItem('lastText', result.text);
      localStorage.setItem('lastSound', result.sound);

      stopCurrentAudio();
      currentAudio = new Audio(`data:audio/mpeg;base64,${result.sound}`);
      currentAudio.onended = () => ui.updateReplayButtonState(false);
      ui.updateReplayButtonState(true);
      currentAudio.play().catch(e => {
        console.error('Audio play error:', e);
        ui.updateReplayButtonState(false);
      });
    }
    ui.updateMainButtonState();
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message, 'error');
      ui.updateMainButtonState();
    }
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
  currentAudio.onended = () => ui.updateReplayButtonState(false);
  ui.updateReplayButtonState(true);
  currentAudio.play().catch(e => {
    console.error('Audio play error:', e);
    ui.updateReplayButtonState(false);
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
  ui.updateMainButtonState();
  document.getElementById('thai-input').focus();
}

// Initial check
checkAuth();

// Attach to window for HTML event handlers
window.toggleView = ui.toggleView;
window.handleSubmit = handleSubmit;
window.handleLogout = handleLogout;
window.handleTranslate = handleTranslate;
window.handleReplay = handleReplay;
window.handleClear = handleClear;
