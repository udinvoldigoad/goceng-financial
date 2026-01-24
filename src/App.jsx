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
import Subscriptions from './pages/Subscriptions';
import NotFound from './pages/NotFound';
import ToastContainer from './components/ui/Toast';
import LoginModal from './components/LoginModal';
import LoadingScreen from './components/ui/LoadingScreen';
import { runNotificationChecks, requestNotificationPermission, showBrowserNotification } from './services/notificationService';

function App() {
  const {
    settings,
    initAuth,
    isAppLoading,
    loadingMessage,
    subscriptions,
    budgets,
    transactions,
    goals,
    notifications,
    addNotification,
  } = useStore();

  // Initialize auth on app mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Check for notifications on data change
  useEffect(() => {
    if (isAppLoading) return;

    const state = { subscriptions, budgets, transactions, goals, notifications };
    const newNotifications = runNotificationChecks(state);

    newNotifications.forEach(notification => {
      addNotification(notification);

      // Also show browser notification for alerts
      if (notification.type === 'alert') {
        showBrowserNotification(notification.title, {
          body: notification.message,
          tag: notification.id,
        });
      }
    });
  }, [subscriptions, budgets, transactions, goals, isAppLoading]);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Show loading screen while initializing
  if (isAppLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

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
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />

            {/* Profile page - Protected, requires authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* 404 Not Found - Catch all undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
