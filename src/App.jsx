import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NoticeProvider, useNotices } from './context/NoticeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NoticeDetailModal from './components/NoticeDetailModal';
import ToastContainer from './components/ToastContainer';
import DashboardPage from './pages/DashboardPage';
import AllNoticesPage from './pages/AllNoticesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AddNoticePage from './pages/AddNoticePage';
import ManageNoticesPage from './pages/ManageNoticesPage';
import StudentViewPage from './pages/StudentViewPage';
import SettingsPage from './pages/SettingsPage';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useNotices();
  const isAdmin = settings.role === 'admin';

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-wrapper">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="page-container">
          <Routes>
            <Route
              path="/"
              element={isAdmin ? <DashboardPage /> : <Navigate to="/student-view" replace />}
            />
            <Route path="/notices" element={<AllNoticesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route
              path="/add-notice"
              element={isAdmin ? <AddNoticePage /> : <Navigate to="/student-view" replace />}
            />
            <Route
              path="/edit-notice/:id"
              element={isAdmin ? <AddNoticePage /> : <Navigate to="/student-view" replace />}
            />
            <Route
              path="/manage"
              element={isAdmin ? <ManageNoticesPage /> : <Navigate to="/student-view" replace />}
            />
            <Route path="/student-view" element={<StudentViewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to={isAdmin ? '/' : '/student-view'} replace />} />
          </Routes>
        </main>
      </div>

      <NoticeDetailModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <NoticeProvider>
      <AppLayout />
    </NoticeProvider>
  );
}
