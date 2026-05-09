import { CONFIG } from './config.js';
import { showToast } from './toast.js';

const API_BASE_URL = CONFIG.API_BASE_URL;

export async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        showToast('Session expired. Please log in again.', 'error');
        window.handleLogout(); // Global fallback
        throw new Error('Unauthorized');
      }
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`API Error (${endpoint}):`, error);
    }
    throw error;
  }
}

export async function login(data) {
  return authFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function register(data) {
  return authFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function translate(text) {
  return authFetch('/translate', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}
