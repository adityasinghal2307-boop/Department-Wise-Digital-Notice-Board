import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, ShieldCheck, GraduationCap } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';

const PAGE_META = {
  '/': {
    title: 'Admin Dashboard',
    subtitle: 'Overview of campus notices, departments, and recent publications',
  },
  '/notices': {
    title: 'All Notices',
    subtitle: 'Search and filter notices across the entire campus',
  },
  '/departments': {
    title: 'Department Notices',
    subtitle: 'Browse department-specific circulars across 7 engineering streams',
  },
  '/add-notice': {
    title: 'Add New Notice',
    subtitle: 'Compose and publish a notice or save it as a draft',
  },
  '/manage': {
    title: 'Manage Notices',
    subtitle: 'Edit, publish, unpublish, or remove department notices',
  },
  '/student-view': {
    title: 'Student Notice Board',
    subtitle: 'Latest verified notices organized for students',
  },
  '/settings': {
    title: 'Settings & Demo Controls',
    subtitle: 'Configure preferences and manage local browser data',
  },
};

export default function Header({ onOpenSidebar }) {
  const { settings, setRole } = useNotices();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditPage = location.pathname.startsWith('/edit-notice');
  const meta = isEditPage
    ? {
        title: 'Edit Notice',
        subtitle: 'Update notice content, priority, department, or expiry date',
      }
    : PAGE_META[location.pathname] || {
        title: 'Digital Notice Board',
        subtitle: settings.collegeName,
      };

  const isAdmin = settings.role === 'admin';

  const handleRoleChange = (nextRole) => {
    if (nextRole === settings.role) return;
    setRole(nextRole);
    if (nextRole === 'student') {
      navigate('/student-view');
    } else if (location.pathname === '/student-view') {
      navigate('/');
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div style={{ minWidth: 0 }}>
          <h1 className="header-title">{meta.title}</h1>
          <p className="header-subtitle">{meta.subtitle}</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="role-switcher" role="group" aria-label="Demo Role Switcher">
          <button
            type="button"
            className={`role-switch-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
            title="Switch to Admin View"
          >
            <ShieldCheck size={15} />
            <span>Admin View</span>
          </button>
          <button
            type="button"
            className={`role-switch-btn ${!isAdmin ? 'student-active' : ''}`}
            onClick={() => handleRoleChange('student')}
            title="Switch to Student View"
          >
            <GraduationCap size={15} />
            <span>Student View</span>
          </button>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/add-notice')}
          >
            <Plus size={16} />
            <span>Add Notice</span>
          </button>
        )}
      </div>
    </header>
  );
}
