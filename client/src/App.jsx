import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminFlats from './pages/AdminFlats.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ResidentDashboard from './pages/ResidentDashboard.jsx';
import SecurityDashboard from './pages/SecurityDashboard.jsx';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/flats" element={<AdminFlats />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['RESIDENT']} />}>
            <Route path="/resident/dashboard" element={<ResidentDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['SECURITY']} />}>
            <Route path="/security/dashboard" element={<SecurityDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
