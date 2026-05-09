import { CONFIG } from './config.js';
import { showToast } from './toast.js';

const API_BASE_URL = CONFIG.API_BASE_URL;

/**
 * Base fetch wrapper for public endpoints (no token, no auto-redirect)
 */
async function baseFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Fetch wrapper for endpoints requiring authentication
 * Automatically adds Bearer token and handles 401 Session Expiration
 */
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
        window.handleLogout();
        throw new Error('Unauthorized');
      }
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      console.error(`Auth API Error (${endpoint}):`, error);
    }
    throw error;
  }
}

// --- Public Functions ---

export async function login(data) {
  return baseFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function register(data) {
  return baseFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// --- Authenticated Functions ---

export async function translate(text) {
  return authFetch('/translate', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}
