export function toggleView(view) {
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

export function updateMainButtonState() {
  const btn = document.getElementById('main-action-btn');
  const resultArea = document.getElementById('result-area');
  const form = document.getElementById('translate-form');
  if (!btn || !resultArea || !form) return;

  const isResultVisible = resultArea.style.display === 'block';

  if (isResultVisible) {
    btn.textContent = 'Clear';
    btn.className = 'btn-clear';
    btn.type = 'button';
    btn.onclick = window.handleClear;
  } else {
    btn.textContent = 'Translate & Play';
    btn.className = 'btn';
    btn.type = 'submit';
    btn.onclick = null;
  }
}

export function updateReplayButtonState(isPlaying) {
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
