import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './features/auth/AuthProvider';
import PrivateRoute from './features/auth/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import App from './App';
import SessionPage from './pages/SessionPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import SessionDetailPage from './pages/SessionDetailPage';
import CommunityPage from './pages/CommunityPage';
import ExampleBreathingPage from './pages/examples/ExampleBreathingPage';
import ExampleDashboardPage from './pages/examples/ExampleDashboardPage';
import ExampleAuthPage from './pages/examples/ExampleAuthPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/session"
            element={
              <PrivateRoute>
                <SessionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/session/:id"
            element={
              <PrivateRoute>
                <SessionDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <PrivateRoute>
                <AchievementsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/community" element={<CommunityPage />} />

          <Route path="/examples/breathing" element={<ExampleBreathingPage />} />
          <Route path="/examples/dashboard" element={<ExampleDashboardPage />} />
          <Route path="/examples/auth" element={<ExampleAuthPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
