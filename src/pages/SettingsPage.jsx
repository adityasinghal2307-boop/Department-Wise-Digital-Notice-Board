import React, { useState } from 'react';
import { RefreshCw, Trash2, Save } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { DEPARTMENTS } from '../data/sampleData';
import ConfirmModal from '../components/ConfirmModal';

export default function SettingsPage() {
  const {
    settings,
    stats,
    setRole,
    updateSettings,
    resetDemoData,
    clearExpiredNotices,
  } = useNotices();

  const [collegeName, setCollegeName] = useState(settings.collegeName);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveCollegeName = (e) => {
    e.preventDefault();
    if (!collegeName.trim()) return;
    updateSettings({ collegeName: collegeName.trim() });
  };

  return (
    <div>
      <div className="page-hero">
        <div>
          <h2 className="page-hero-title">Application Settings</h2>
          <p className="page-hero-desc">
            Configure demo role preferences, student view defaults, and browser localStorage data.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="surface-card">
          <div className="panel-header">
            <h3 className="panel-title">Display & Role Preferences</h3>
          </div>
          <div className="panel-body">
            <div className="setting-row">
              <div>
                <div style={{ fontWeight: 600 }}>Active Demo Mode</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Switch between Admin management tools and Student notice board.
                </div>
              </div>
              <select
                className="form-control"
                style={{ width: 'auto', minWidth: 155 }}
                value={settings.role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin View</option>
                <option value="student">Student View</option>
              </select>
            </div>

            <div className="setting-row">
              <div>
                <div style={{ fontWeight: 600 }}>Default Student Department</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Pre-selected department filter when opening Student View.
                </div>
              </div>
              <select
                className="form-control"
                style={{ width: 'auto', minWidth: 155 }}
                value={settings.defaultDepartment}
                onChange={(e) => updateSettings({ defaultDepartment: e.target.value })}
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-row">
              <div>
                <div style={{ fontWeight: 600 }}>Show Expired Notices to Students</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Include past-expiry archived circulars in Student View.
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showExpiredInStudentView}
                  onChange={(e) =>
                    updateSettings({ showExpiredInStudentView: e.target.checked })
                  }
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <form onSubmit={handleSaveCollegeName} style={{ marginTop: 18 }}>
              <label htmlFor="college-name-input" className="form-label">
                Institution Name
              </label>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <input
                  id="college-name-input"
                  type="text"
                  className="form-control"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={15} />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="surface-card">
          <div className="panel-header">
            <h3 className="panel-title">Local Storage Data Management</h3>
          </div>
          <div className="panel-body">
            <div className="setting-row">
              <div>
                <div style={{ fontWeight: 600 }}>Purge Expired Notices</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Remove {stats.expired} expired notice{stats.expired === 1 ? '' : 's'} from
                  localStorage.
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearExpiredNotices}
                disabled={stats.expired === 0}
              >
                <Trash2 size={15} />
                <span>Clear Expired</span>
              </button>
            </div>

            <div className="setting-row">
              <div>
                <div style={{ fontWeight: 600 }}>Reset Sample Demo Data</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Restore the 10 realistic college sample notices across all 7 departments.
                </div>
              </div>
              <button
                type="button"
                className="btn btn-soft-danger btn-sm"
                onClick={() => setConfirmResetOpen(true)}
              >
                <RefreshCw size={15} />
                <span>Reset Data</span>
              </button>
            </div>

            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-soft)',
                border: '1px solid var(--primary-border)',
                fontSize: '0.83rem',
                color: 'var(--primary-dark)',
              }}
            >
              <strong>Frontend-Only Storage:</strong> All notices are persisted locally in your
              browser&apos;s <code>localStorage</code> and survive page refreshes without any backend
              server.
            </div>
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={confirmResetOpen}
        title="Reset Demo Notices?"
        message="This will replace your current notices in localStorage with the original 10 sample college notices. Any custom notices you added will be lost."
        confirmLabel="Reset to Default"
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setConfirmResetOpen(false);
        }}
      />
    </div>
  );
}
