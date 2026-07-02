import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { normalizeRole } from '../utils/auth.js';

const navigation = [
  { label: 'Admin dashboard', to: '/admin/dashboard', shortLabel: 'A', role: 'ADMIN' },
  { label: 'Resident dashboard', to: '/resident/dashboard', shortLabel: 'R', role: 'RESIDENT' },
  { label: 'Security dashboard', to: '/security/dashboard', shortLabel: 'S', role: 'SECURITY' },
];

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const visibleNavigation = navigation.filter((item) => item.role === normalizeRole(user?.role));

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 font-bold">
            SF
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide">SocietyFlow</p>
            <p className="text-xs text-slate-400">Community portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Main navigation">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dashboards
          </p>
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-xs">
                {item.shortLabel}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 text-xs leading-5 text-slate-400">
          Manage your community from one secure workspace.
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
