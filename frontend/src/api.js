
import { auth } from './firebase';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function api(path, options = {}) {
  const user = auth.currentUser;

  let token = null;

  if (user) {
    token = await user.getIdToken();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

export { API };
