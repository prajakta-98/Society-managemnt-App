export const AUTH_TOKEN_KEY = 'societyflow_token';
export const AUTH_USER_KEY = 'societyflow_user';

const dashboardPaths = {
  ADMIN: '/admin/dashboard',
  RESIDENT: '/resident/dashboard',
  SECURITY: '/security/dashboard',
};

export function normalizeRole(role) {
  return typeof role === 'string' ? role.toUpperCase() : '';
}

export function getDashboardPath(role) {
  return dashboardPaths[normalizeRole(role)] || '/login';
}

export function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}
