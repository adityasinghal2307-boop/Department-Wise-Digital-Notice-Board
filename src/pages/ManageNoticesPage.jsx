import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3,
  Eye,
  Globe,
  FileEdit,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { DEPARTMENTS } from '../data/sampleData';
import { formatDisplayDate, getNoticeLifecycleStatus } from '../utils/dateUtils';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';

export default function ManageNoticesPage() {
  const { notices, deleteNotice, togglePublishStatus, setActiveModalNotice } = useNotices();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredNotices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notices.filter((notice) => {
      if (deptFilter !== 'ALL' && notice.department !== deptFilter) return false;
      if (statusFilter !== 'ALL' && getNoticeLifecycleStatus(notice) !== statusFilter) {
        return false;
      }
      if (q) {
        const hay = `${notice.title} ${notice.postedBy} ${notice.category} ${notice.department}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [notices, searchQuery, deptFilter, statusFilter]);

  return (
    <div>
      <div className="page-hero">
        <div>
          <h2 className="page-hero-title">Manage Notices</h2>
          <p className="page-hero-desc">
            Control notice visibility, update deadlines, or remove outdated announcements.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/add-notice')}
        >
          <Plus size={17} />
          <span>Add New Notice</span>
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={17} className="search-input-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, issuer, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-control filter-select"
          aria-label="Filter by Department"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.id}
            </option>
          ))}
        </select>

        <select
          className="form-control filter-select"
          aria-label="Filter by Lifecycle Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {filteredNotices.length === 0 ? (
        <EmptyState
          title="No notices to manage"
          description="No notices match the selected filters, or the notice board is empty."
          actionLabel="Create Notice"
          onAction={() => navigate('/add-notice')}
        />
      ) : (
        <div className="surface-card table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Notice Title</th>
                <th>Department</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Expiry Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map((notice) => {
                const lifecycle = getNoticeLifecycleStatus(notice);
                const isPublished = notice.status === 'Published';
                return (
                  <tr key={notice.id}>
                    <td className="table-title-cell">
                      <div
                        className="table-notice-title"
                        onClick={() => setActiveModalNotice(notice)}
                      >
                        {notice.title}
                      </div>
                      <div className="table-notice-sub">By {notice.postedBy}</div>
                    </td>
                    <td>
                      <span className="badge badge-dept">{notice.department}</span>
                    </td>
                    <td>
                      <span className="badge badge-category">{notice.category}</span>
                    </td>
                    <td>
                      <span className={`badge badge-priority-${notice.priority}`}>
                        {notice.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-status-${lifecycle}`}>{lifecycle}</span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {formatDisplayDate(notice.expiryDate)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-group">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setActiveModalNotice(notice)}
                          title="View full notice"
                          aria-label="View notice"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => togglePublishStatus(notice.id)}
                          title={isPublished ? 'Move to Draft' : 'Publish Notice'}
                          aria-label={isPublished ? 'Unpublish notice' : 'Publish notice'}
                        >
                          {isPublished ? <FileEdit size={15} /> : <Globe size={15} />}
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => navigate(`/edit-notice/${notice.id}`)}
                          title="Edit notice"
                          aria-label="Edit notice"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => setDeleteTarget(notice)}
                          title="Delete notice"
                          aria-label="Delete notice"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Confirm Notice Deletion"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}" from ${deleteTarget.department}? This action cannot be undone.`
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
