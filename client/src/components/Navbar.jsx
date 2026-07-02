import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function getInitials(user) {
  const displayName = user?.name || user?.fullName || user?.email || 'SocietyFlow User';
  return displayName
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || 'user';
  const displayName = user?.name || user?.fullName || user?.email || 'SocietyFlow User';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          onClick={onMenuClick}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          <p className="text-sm font-semibold capitalize text-slate-800">{role} portal</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-48 truncate text-sm font-semibold text-slate-800">{displayName}</p>
          <p className="text-xs capitalize text-slate-500">{role}</p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {getInitials(user)}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
