import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Building2,
  PlusCircle,
  ArrowRight,
  SlidersHorizontal,
  GraduationCap,
} from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { DEPARTMENTS } from '../data/sampleData';
import {
  formatRelativeTime,
  getNoticeLifecycleStatus,
  isNoticeActive,
} from '../utils/dateUtils';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';

export default function DashboardPage() {
  const { notices, stats, setActiveModalNotice, setRole } = useNotices();
  const navigate = useNavigate();

  const recentPublished = useMemo(
    () => notices.filter((n) => n.status === 'Published').slice(0, 5),
    [notices]
  );

  const deptBreakdown = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const deptNotices = notices.filter((n) => n.department === dept.id);
      const activeCount = deptNotices.filter((n) => isNoticeActive(n)).length;
      return {
        ...dept,
        totalCount: deptNotices.length,
        activeCount,
      };
    });
  }, [notices]);

  const maxDeptCount = Math.max(1, ...deptBreakdown.map((d) => d.totalCount));

  return (
    <div>
      <div className="page-hero">
        <div>
          <h2 className="page-hero-title">Campus Notice Overview</h2>
          <p className="page-hero-desc">
            Monitor active circulars, department distribution, and publish updates across campus.
          </p>
        </div>
        <div className="action-group" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setRole('student');
              navigate('/student-view');
            }}
          >
            <GraduationCap size={17} />
            <span>Preview Student View</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/add-notice')}
          >
            <PlusCircle size={17} />
            <span>Publish Notice</span>
          </button>
        </div>
      </div>

      <section className="stats-grid" aria-label="Key Statistics">
        <StatCard
          label="Total Notices"
          value={stats.total}
          subtext={`${stats.drafts} saved as draft`}
          icon={FileText}
          tone="blue"
        />
        <StatCard
          label="Active Notices"
          value={stats.active}
          subtext="Currently live for students"
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          label="Expired Notices"
          value={stats.expired}
          subtext="Past validity date"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Total Departments"
          value={stats.totalDepartments}
          subtext="CSE, AI & ML, IT, ECE, ME, CE, EE"
          icon={Building2}
          tone="indigo"
        />
      </section>

      <div className="dashboard-grid">
        {/* Recently Published Notices */}
        <section className="surface-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Recently Published Notices</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Latest circulars ordered by publication timestamp
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/notices')}
            >
              <span>View All</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="panel-body">
            {recentPublished.length === 0 ? (
              <EmptyState
                title="No published notices yet"
                description="Publish your first department notice to see it here."
                actionLabel="Add Notice"
                onAction={() => navigate('/add-notice')}
              />
            ) : (
              recentPublished.map((notice) => {
                const lifecycle = getNoticeLifecycleStatus(notice);
                return (
                  <div key={notice.id} className="recent-notice-item">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="notice-badges" style={{ marginBottom: 6 }}>
                        <span className="badge badge-dept">{notice.department}</span>
                        <span className="badge badge-category">{notice.category}</span>
                        <span className={`badge badge-priority-${notice.priority}`}>
                          {notice.priority}
                        </span>
                        <span className={`badge badge-status-${lifecycle}`}>{lifecycle}</span>
                      </div>
                      <div
                        className="table-notice-title"
                        onClick={() => setActiveModalNotice(notice)}
                      >
                        {notice.title}
                      </div>
                      <div className="table-notice-sub">
                        {notice.postedBy} • Published {formatRelativeTime(notice.publishedAt)}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveModalNotice(notice)}
                    >
                      View
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Department Breakdown & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section className="surface-card">
            <div className="panel-header">
              <h3 className="panel-title">Department Breakdown</h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/departments')}
              >
                Explore
              </button>
            </div>
            <div className="panel-body">
              {deptBreakdown.map((dept) => {
                const widthPct = Math.round((dept.totalCount / maxDeptCount) * 100);
                return (
                  <div
                    key={dept.id}
                    className="dept-progress-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/departments?dept=${encodeURIComponent(dept.id)}`)}
                  >
                    <div className="dept-progress-top">
                      <span>{dept.id}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                        {dept.activeCount} active / {dept.totalCount} total
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${widthPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="surface-card">
            <div className="panel-header">
              <h3 className="panel-title">Quick Administration</h3>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between' }}
                onClick={() => navigate('/add-notice')}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <PlusCircle size={16} color="var(--primary)" />
                  Create New Notice
                </span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: 'space-between' }}
                onClick={() => navigate('/manage')}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <SlidersHorizontal size={16} color="var(--primary)" />
                  Manage & Edit Notices
                </span>
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
