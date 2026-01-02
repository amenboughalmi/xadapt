import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAuthStore } from './store';
import { useSocketConnect } from './hooks/socket';
import { ToastProvider } from './components/Toast';

// Pages
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import DashboardPro from './pages/DashboardPro.tsx';
import Events from './pages/Events.tsx';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/login" />;
};

// Main App Component
function App() {
  const token = useAuthStore((state) => state.token);

  // Connect socket when token is available
  useSocketConnect(token);

  useEffect(() => {
    // Set initial auth state from localStorage
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      useAuthStore.setState({ token: savedToken });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard-pro"
              element={
                <ProtectedRoute>
                  <DashboardPro />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to={token ? '/dashboard-pro' : '/login'} />} />
          </Routes>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
