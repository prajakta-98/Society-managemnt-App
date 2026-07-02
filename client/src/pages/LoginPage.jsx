import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardPath } from '../utils/auth.js';

function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isInitializing,
    isLoading,
    error,
    login,
    clearError,
  } = useAuth();

  useEffect(() => () => clearError(), []);

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));

    if (error) {
      clearError();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const loggedInUser = await login({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      navigate(getDashboardPath(loggedInUser.role), { replace: true });
    } catch {
      // AuthContext exposes the API error for the form to render.
    }
  }

  if (!isInitializing && isAuthenticated) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 font-bold text-white">
          SF
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome to SocietyFlow</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage your community workspace.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            minLength="6"
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || isInitializing}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {(isLoading || isInitializing) && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {isLoading ? 'Signing in...' : isInitializing ? 'Checking session...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">
        Secure access for administrators, residents, and security staff.
      </p>
    </section>
  );
}

export default LoginPage;
