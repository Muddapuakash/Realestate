const TOKEN_KEY = "auth_token"; // LocalStorage Key

// Save user token
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Get user token
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Remove user token
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getToken();
}
