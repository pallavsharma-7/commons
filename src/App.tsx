import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { BookingsPage } from './pages/BookingsPage';
import { RequestsPage } from './pages/RequestsPage';
import { ActivityPage } from './pages/ActivityPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'student' | 'owner' | 'admin'>('student');

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <AppLayout 
              currentRole={currentRole} 
              onRoleChange={setCurrentRole} 
            />
          }
        >
          {/* Core Routes */}
          <Route index element={<DashboardPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="resource/:id" element={<ResourceDetailPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="activity" element={<ActivityPage />} />
          
          {/* Role Perspectives */}
          <Route path="owner-dashboard" element={<OwnerDashboardPage />} />
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
          
          {/* General Routes */}
          <Route 
            path="settings" 
            element={
              <SettingsPage 
                currentRole={currentRole} 
                onRoleChange={setCurrentRole} 
              />
            } 
          />
          <Route path="help" element={<HelpPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
