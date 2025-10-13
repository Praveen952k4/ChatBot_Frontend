const API_BASE_URL = 'https://chatbot-backend-tjxu.onrender.com/api';

// Helper function to handle responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  return data;
};

// Auth API
export const authApi = {
  signup: (userData: { email: string; password: string; name: string }) => 
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    }).then(handleResponse),

  signin: (credentials: { email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    }).then(handleResponse),

  getProfile: () =>
    fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};

// Chat API
export const chatApi = {
  getSessions: () =>
    fetch(`${API_BASE_URL}/chat/sessions`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  createSession: (title: string) =>
    fetch(`${API_BASE_URL}/chat/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
      credentials: 'include',
    }).then(handleResponse),

  getMessages: (sessionId: string) =>
    fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  postMessage: (sessionId: string, content: string) =>
    fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
      credentials: 'include',
    }).then(handleResponse),
};

// Organization API
export const organizationApi = {
  create: (name: string) =>
    fetch(`${API_BASE_URL}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      credentials: 'include',
    }).then(handleResponse),

  getUserOrgs: () =>
    fetch(`${API_BASE_URL}/organizations`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  switchActive: (orgId: string) =>
    fetch(`${API_BASE_URL}/organizations/switch`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId }),
      credentials: 'include',
    }).then(handleResponse),

  getMembers: (orgId: string) =>
    fetch(`${API_BASE_URL}/organizations/${orgId}/members`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  rename: (orgId: string, newName: string) =>
    fetch(`${API_BASE_URL}/organizations/${orgId}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
      credentials: 'include',
    }).then(handleResponse),

  inviteMember: (orgId: string, email: string) =>
    fetch(`${API_BASE_URL}/organizations/${orgId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include',
    }).then(handleResponse),
};

// Notification API
export const notificationApi = {
  getNotifications: () =>
    fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      credentials: 'include',
    }).then(handleResponse),

  markAsRead: (notificationId: string) =>
    fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      credentials: 'include',
    }).then(handleResponse),
};

export default {
  auth: authApi,
  chat: chatApi,
  organization: organizationApi,
  notification: notificationApi,
};
