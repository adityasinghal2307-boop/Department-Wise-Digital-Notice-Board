import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Search } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { CATEGORIES, DEPARTMENTS } from '../data/sampleData';
import { isNoticeActive, isNoticeExpired } from '../utils/dateUtils';
import NoticeCard from '../components/NoticeCard';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

export default function DepartmentsPage() {
  const { notices, settings, setActiveModalNotice, deleteNotice } = useNotices();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isAdmin = settings.role === 'admin';
  const paramDept = searchParams.get('dept');

  const [selectedDept, setSelectedDept] = useState(paramDept || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (paramDept && DEPARTMENTS.some((d) => d.id === paramDept)) {
      setSelectedDept(paramDept);
    }
  }, [paramDept]);

  const handleSelectDept = (deptId) => {
    setSelectedDept(deptId);
    if (deptId === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ dept: deptId });
    }
  };

  const deptCounts = useMemo(() => {
    const map = {};
    DEPARTMENTS.forEach((d) => {
      const visible = notices.filter((n) => {
        if (n.department !== d.id) return false;
        if (!isAdmin) {
          if (n.status !== 'Published') return false;
          if (!settings.showExpiredInStudentView && isNoticeExpired(n.expiryDate)) return false;
        }
        return true;
      });
      map[d.id] = {
        total: visible.length,
        active: visible.filter((n) => isNoticeActive(n)).length,
      };
    });
    return map;
  }, [notices, isAdmin, settings.showExpiredInStudentView]);

  const filteredNotices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return notices.filter((notice) => {
      if (!isAdmin) {
        if (notice.status !== 'Published') return false;
        if (!settings.showExpiredInStudentView && isNoticeExpired(notice.expiryDate)) {
          return false;
        }
      }

      if (selectedDept !== 'ALL' && notice.department !== selectedDept) return false;
      if (selectedCategory !== 'ALL' && notice.category !== selectedCategory) return false;

      if (query) {
        const text = `${notice.title} ${notice.description} ${notice.postedBy}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      return true;
    });
  }, [
    notices,
    isAdmin,
    settings.showExpiredInStudentView,
    selectedDept,
    selectedCategory,
    searchQuery,
  ]);

  const activeDepartmentInfo = DEPARTMENTS.find((d) => d.id === selectedDept);

  return (
    <div>
      <div className="page-hero">
        <div>
          <h2 className="page-hero-title">Academic Departments</h2>
          <p className="page-hero-desc">
            Select any department card below to view circulars specific to that branch.
          </p>
        </div>
        {selectedDept !== 'ALL' && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSelectDept('ALL')}
          >
            Show All Departments
          </button>
        )}
      </div>

      <div className="departments-grid">
        {DEPARTMENTS.map((dept) => {
          const counts = deptCounts[dept.id] || { total: 0, active: 0 };
          const isSelected = selectedDept === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              className={`dept-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectDept(isSelected ? 'ALL' : dept.id)}
            >
              <div className="dept-card-header">
                <span className="dept-code-pill">{dept.id}</span>
                <span className="dept-count">
                  {counts.active} active • {counts.total} total
                </span>
              </div>
              <div className="dept-full-name">{dept.name}</div>
              <div className="dept-meta">
                {dept.hod} • {dept.block}
              </div>
            </button>
          );
        })}
      </div>

      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
          <Building2 size={18} color="var(--primary)" />
          <span>
            {activeDepartmentInfo ? `${activeDepartmentInfo.id} Notices` : 'All Department Notices'}
          </span>
        </div>

        <div className="search-input-wrap">
          <Search size={17} className="search-input-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search within selected department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-control filter-select"
          aria-label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filteredNotices.length === 0 ? (
        <EmptyState
          title="No notices for this selection"
          description={
            activeDepartmentInfo
              ? `There are currently no notices matching your filters under ${activeDepartmentInfo.name}.`
              : 'Try clearing the search query or choosing another category.'
          }
          actionLabel="Reset Filters"
          onAction={() => {
            handleSelectDept('ALL');
            setSelectedCategory('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="notices-grid">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              showAdminActions={isAdmin}
              onView={(item) => setActiveModalNotice(item)}
              onEdit={(item) => navigate(`/edit-notice/${item.id}`)}
              onDelete={(item) => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Notice"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"?`
            : ''
        }
        confirmLabel="Delete Notice"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteNotice(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
