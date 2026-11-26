import React, { useEffect } from 'react';
import { Calendar, Edit3, Printer, User, X } from 'lucide-react';
import { formatDisplayDate, getNoticeLifecycleStatus } from '../utils/dateUtils';
import { useNotices } from '../context/NoticeContext';
import { useNavigate } from 'react-router-dom';

export default function NoticeDetailModal() {
  const { activeModalNotice, setActiveModalNotice, settings } = useNotices();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalNotice(null);
      }
    };
    if (activeModalNotice) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalNotice, setActiveModalNotice]);

  if (!activeModalNotice) return null;

  const lifecycle = getNoticeLifecycleStatus(activeModalNotice);
  const isAdmin = settings.role === 'admin';

  const handleEditClick = () => {
    const id = activeModalNotice.id;
    setActiveModalNotice(null);
    navigate(`/edit-notice/${id}`);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setActiveModalNotice(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="notice-badges" style={{ marginBottom: 10 }}>
              <span className="badge badge-dept">{activeModalNotice.department}</span>
              <span className="badge badge-category">{activeModalNotice.category}</span>
              <span className={`badge badge-priority-${activeModalNotice.priority}`}>
                {activeModalNotice.priority} Priority
              </span>
              <span className={`badge badge-status-${lifecycle}`}>{lifecycle}</span>
            </div>
            <h2 id="notice-modal-title" style={{ fontSize: '1.25rem', lineHeight: 1.35 }}>
              {activeModalNotice.title}
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setActiveModalNotice(null)}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="notice-detail-grid">
            <div>
              <div className="detail-kv-label">Issued By</div>
              <div className="detail-kv-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} color="var(--primary)" />
                {activeModalNotice.postedBy}
              </div>
            </div>
            <div>
              <div className="detail-kv-label">Department</div>
              <div className="detail-kv-value">{activeModalNotice.department}</div>
            </div>
            <div>
              <div className="detail-kv-label">Published Date</div>
              <div className="detail-kv-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} color="var(--primary)" />
                {formatDisplayDate(activeModalNotice.publishedAt)}
              </div>
            </div>
            <div>
              <div className="detail-kv-label">Valid Until</div>
              <div className="detail-kv-value">{formatDisplayDate(activeModalNotice.expiryDate)}</div>
            </div>
          </div>

          <div className="notice-detail-description">{activeModalNotice.description}</div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
          >
            <Printer size={15} />
            <span>Print</span>
          </button>
          {isAdmin && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleEditClick}
            >
              <Edit3 size={15} />
              <span>Edit Notice</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActiveModalNotice(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
