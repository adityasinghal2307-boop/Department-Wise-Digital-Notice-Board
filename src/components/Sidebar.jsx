import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Building2,
  PlusCircle,
  SlidersHorizontal,
  GraduationCap,
  Settings,
  X,
} from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import logoSvg from '../assets/logo.svg';

export default function Sidebar({ isOpen, onClose }) {
  const { settings, stats } = useNotices();
  const isAdmin = settings.role === 'admin';

  const navItems = isAdmin
    ? [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/notices', label: 'All Notices', icon: FileText, badge: stats.total },
        { to: '/departments', label: 'Department Notices', icon: Building2, badge: stats.totalDepartments },
        { to: '/add-notice', label: 'Add Notice', icon: PlusCircle },
        { to: '/manage', label: 'Manage Notices', icon: SlidersHorizontal },
        { to: '/student-view', label: 'Student View', icon: GraduationCap },
        { to: '/settings', label: 'Settings', icon: Settings },
      ]
    : [
        { to: '/student-view', label: 'Student View', icon: GraduationCap, badge: stats.active },
        { to: '/notices', label: 'All Notices', icon: FileText, badge: stats.active },
        { to: '/departments', label: 'Department Notices', icon: Building2, badge: stats.totalDepartments },
        { to: '/settings', label: 'Settings', icon: Settings },
      ];

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Primary Navigation">
        <div className="sidebar-brand">
          <img src={logoSvg} alt="CampusPulse Logo" className="sidebar-brand-icon" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="sidebar-brand-title">CampusPulse</div>
            <div className="sidebar-brand-sub">Digital Notice Board</div>
          </div>
          {isOpen && (
            <button
              type="button"
              className="icon-btn mobile-menu-btn"
              onClick={onClose}
              aria-label="Close navigation"
              style={{ display: 'inline-flex' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="sidebar-section-label">
          {isAdmin ? 'Admin Portal' : 'Student Portal'}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-role-card">
            <div className={`role-avatar ${isAdmin ? 'admin' : 'student'}`}>
              {isAdmin ? 'AD' : 'ST'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {isAdmin ? 'Administrator' : 'Student Demo'}
              </div>
              <div
                style={{
                  fontSize: '0.73rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {settings.collegeName}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
