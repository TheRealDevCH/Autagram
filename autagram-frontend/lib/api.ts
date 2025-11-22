const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const auth = {
  register: (data: { name: string; username: string; email: string; password: string }) =>
    apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/logout', {
      method: 'POST',
    }),

  getUser: () => apiRequest('/user'),
};

export const posts = {
  getAll: () => apiRequest('/posts'),
  
  getFeed: () => apiRequest('/feed'),
  
  getById: (id: number) => apiRequest(`/posts/${id}`),
  
  create: (formData: FormData) =>
    apiRequest('/posts', {
      method: 'POST',
      body: formData,
    }),
  
  delete: (id: number) =>
    apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    }),
  
  react: (id: number, reactionType: string) =>
    apiRequest(`/posts/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ reaction_type: reactionType }),
    }),

  unlike: (id: number) =>
    apiRequest(`/posts/${id}/unlike`, {
      method: 'DELETE',
    }),
};

export const users = {
  getById: (id: number) => apiRequest(`/users/${id}`),
  
  update: (id: number, formData: FormData) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  
  updatePreferences: (id: number, data: { likes?: string; dislikes?: string; too_much?: string }) =>
    apiRequest(`/users/${id}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  follow: (id: number) =>
    apiRequest(`/users/${id}/follow`, {
      method: 'POST',
    }),
  
  unfollow: (id: number) =>
    apiRequest(`/users/${id}/unfollow`, {
      method: 'DELETE',
    }),
  
  getFollowers: (id: number) => apiRequest(`/users/${id}/followers`),
  
  getFollowing: (id: number) => apiRequest(`/users/${id}/following`),
};

