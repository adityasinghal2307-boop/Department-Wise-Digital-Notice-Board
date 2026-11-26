import React from 'react';
import { Calendar, Clock, Edit3, Eye, Trash2, User } from 'lucide-react';
import {
  formatDisplayDate,
  formatRelativeTime,
  getNoticeLifecycleStatus,
} from '../utils/dateUtils';

export default function NoticeCard({
  notice,
  onView,
  onEdit,
  onDelete,
  showAdminActions = false,
}) {
  const lifecycle = getNoticeLifecycleStatus(notice);

  return (
    <article
      className={`notice-card priority-${notice.priority} ${
        lifecycle === 'Expired' ? 'expired-card' : ''
      }`}
    >
      <div className="notice-card-top">
        <div className="notice-badges">
          <span className="badge badge-dept">{notice.department}</span>
          <span className="badge badge-category">{notice.category}</span>
        </div>
        <div className="notice-badges">
          <span className={`badge badge-priority-${notice.priority}`}>
            {notice.priority}
          </span>
          <span className={`badge badge-status-${lifecycle}`}>{lifecycle}</span>
        </div>
      </div>

      <h3 className="notice-title" onClick={() => onView(notice)}>
        {notice.title}
      </h3>

      <p className="notice-excerpt">{notice.description}</p>

      <div className="notice-meta">
        <span className="notice-meta-item" title="Issued by">
          <User size={13} />
          {notice.postedBy}
        </span>
        <span className="notice-meta-item" title={`Published on ${formatDisplayDate(notice.publishedAt)}`}>
          <Clock size={13} />
          {formatRelativeTime(notice.publishedAt)}
        </span>
      </div>

      <div className="notice-card-actions">
        <span
          className="notice-meta-item"
          style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}
        >
          <Calendar size={13} />
          Valid till {formatDisplayDate(notice.expiryDate)}
        </span>

        <div className="action-group">
          {showAdminActions && onEdit && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => onEdit(notice)}
              title="Edit notice"
              aria-label="Edit notice"
            >
              <Edit3 size={15} />
            </button>
          )}
          {showAdminActions && onDelete && (
            <button
              type="button"
              className="icon-btn danger"
              onClick={() => onDelete(notice)}
              title="Delete notice"
              aria-label="Delete notice"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onView(notice)}
          >
            <Eye size={14} />
            <span>View</span>
          </button>
        </div>
      </div>
    </article>
  );
}
