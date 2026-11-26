import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { CATEGORIES, DEPARTMENTS } from '../data/sampleData';
import { getNoticeLifecycleStatus, isNoticeExpired } from '../utils/dateUtils';
import NoticeCard from '../components/NoticeCard';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

export default function AllNoticesPage() {
  const { notices, settings, setActiveModalNotice, deleteNotice } = useNotices();
  const navigate = useNavigate();

  const isAdmin = settings.role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredNotices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notices.filter((notice) => {
      if (!isAdmin) {
        if (notice.status !== 'Published') return false;
        if (!settings.showExpiredInStudentView && isNoticeExpired(notice.expiryDate)) {
          return false;
        }
      }

      if (selectedDept !== 'ALL' && notice.department !== selectedDept) {
        return false;
      }

      if (selectedCategory !== 'ALL' && notice.category !== selectedCategory) {
        return false;
      }

      if (isAdmin && selectedStatus !== 'ALL') {
        const lifecycle = getNoticeLifecycleStatus(notice);
        if (lifecycle !== selectedStatus) return false;
      }

      if (query) {
        const haystack = [
          notice.title,
          notice.description,
          notice.department,
          notice.category,
          notice.postedBy,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [
    notices,
    isAdmin,
    settings.showExpiredInStudentView,
    selectedDept,
    selectedCategory,
    selectedStatus,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div>
      <div className="page-hero">
        <div>
          <h2 className="page-hero-title">All Campus Notices</h2>
          <p className="page-hero-desc">
            Showing {filteredNotices.length} notice{filteredNotices.length === 1 ? '' : 's'} sorted
            with latest publications first.
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={17} className="search-input-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search notices by title, keyword, department, or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-control filter-select"
          aria-label="Filter by Department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.id}
            </option>
          ))}
        </select>

        {isAdmin && (
          <select
            className="form-control filter-select"
            aria-label="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Draft">Draft</option>
          </select>
        )}

        {(searchQuery || selectedDept !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleResetFilters}>
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="chip-row" role="group" aria-label="Filter by Category">
        <button
          type="button"
          className={`filter-chip ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('ALL')}
        >
          All Categories
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredNotices.length === 0 ? (
        <EmptyState
          title="No matching notices"
          description="No notices match your current search or filter criteria."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
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
            ? `Are you sure you want to permanently delete "${deleteTarget.title}"? This action cannot be undone.`
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
