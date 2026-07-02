import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardPath, normalizeRole } from '../utils/auth.js';
import Loader from './Loader.jsx';

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Loader label="Restoring your session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const normalizedRole = normalizeRole(user.role);

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to={getDashboardPath(normalizedRole)} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
