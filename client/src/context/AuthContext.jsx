import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  getDashboardPath,
  normalizeRole,
  readStoredUser,
} from '../utils/auth.js';

const AuthContext = createContext(null);
const DEMO_ACCESS_TOKEN = 'societyflow-demo-admin';
const DEMO_ADMIN_USER = {
  id: 'demo-admin',
  name: 'Demo Administrator',
  email: 'admin@societyflow.demo',
  role: 'ADMIN',
};

function getResponsePayload(response) {
  return response.data?.data || response.data;
}

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Unable to sign in. Please try again.';
}

function normalizeUser(user) {
  return user ? { ...user, role: normalizeRole(user.role) } : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(() => normalizeUser(readStoredUser()));
  const [isInitializing, setIsInitializing] = useState(
    Boolean(token && token !== DEMO_ACCESS_TOKEN),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  }

  function saveSession(nextToken, nextUser) {
    const normalizedUser = normalizeUser(nextUser);

    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
    setToken(nextToken);
    setUser(normalizedUser);

    return normalizedUser;
  }

  useEffect(() => {
    if (!token) {
      setIsInitializing(false);
      return undefined;
    }

    if (token === DEMO_ACCESS_TOKEN) {
      return undefined;
    }

    let isActive = true;

    async function restoreSession() {
      try {
        const response = await api.get('/auth/me');
        const payload = getResponsePayload(response);

        if (!payload?.user) {
          throw new Error('Unable to restore the saved session.');
        }

        if (isActive) {
          saveSession(token, payload.user);
        }
      } catch {
        if (isActive) {
          clearSession();
        }
      } finally {
        if (isActive) {
          setIsInitializing(false);
        }
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  async function login(credentials) {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', credentials);
      const payload = getResponsePayload(response);
      const nextToken = payload?.token || payload?.accessToken;
      const nextUser = payload?.user;

      if (!nextToken || !nextUser) {
        throw new Error('The login response did not include a user and token.');
      }

      if (getDashboardPath(nextUser.role) === '/login') {
        throw new Error('This account does not have a supported dashboard role.');
      }

      return saveSession(nextToken, nextUser);
    } catch (loginError) {
      const message = getErrorMessage(loginError);
      setError(message);
      throw loginError;
    } finally {
      setIsLoading(false);
    }
  }

  function loginAsDemo() {
    setError('');
    return saveSession(DEMO_ACCESS_TOKEN, DEMO_ADMIN_USER);
  }

  function logout() {
    clearSession();
    setError('');
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isInitializing,
      isLoading,
      error,
      login,
      loginAsDemo,
      logout,
      clearError: () => setError(''),
    }),
    [user, token, isInitializing, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
