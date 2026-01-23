import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useStore from './store/useStore';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ToastContainer from './components/ui/Toast';
import LoginModal from './components/LoginModal';

function App() {
  const { settings, initAuth } = useStore();

  // Initialize auth on app mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <>
      <ToastContainer />
      <LoginModal />
      <BrowserRouter>
        <Routes>
          {/* Dashboard Layout - All pages accessible */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />

            {/* Profile page - Protected, requires authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
