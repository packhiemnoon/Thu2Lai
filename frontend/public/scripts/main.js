function toggleView(view) {
  document.body.setAttribute('data-view', view);
  // Reset form
  document.getElementById('auth-form').reset();
}

function handleSubmit(event) {
  event.preventDefault();
  const view = document.body.getAttribute('data-view');
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  alert(`${view === 'login' ? 'Logging in' : 'Signing up'} as: ${data.username}`);
  // This is where we would call the API
}

// Global scope attachment for the inline onclick handler if necessary
// but better to use event listeners in a refactor
window.toggleView = toggleView;
window.handleSubmit = handleSubmit;
