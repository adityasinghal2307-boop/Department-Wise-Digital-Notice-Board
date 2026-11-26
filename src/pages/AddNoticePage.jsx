import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import NoticeForm from '../components/NoticeForm';
import EmptyState from '../components/EmptyState';

export default function AddNoticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notices, addNotice, updateNotice } = useNotices();

  const isEditing = Boolean(id);
  const existingNotice = isEditing ? notices.find((item) => item.id === id) : null;

  if (isEditing && !existingNotice) {
    return (
      <EmptyState
        title="Notice not found"
        description="The notice you attempted to edit may have been deleted."
        actionLabel="Back to Manage Notices"
        onAction={() => navigate('/manage')}
      />
    );
  }

  const handleSubmit = (payload) => {
    if (isEditing) {
      updateNotice(existingNotice.id, payload);
      navigate('/manage');
    } else {
      addNotice(payload);
      navigate('/notices');
    }
  };

  return (
    <div>
      <div className="page-hero">
        <div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(-1)}
            style={{ marginBottom: 8, paddingLeft: 4 }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h2 className="page-hero-title">
            {isEditing ? 'Edit Department Notice' : 'Publish New Notice'}
          </h2>
          <p className="page-hero-desc">
            {isEditing
              ? 'Update details, priority, or validity date and save changes.'
              : 'Fill out the notice details below. Required fields are marked with an asterisk (*).'}
          </p>
        </div>
      </div>

      <NoticeForm
        initialData={existingNotice}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        onCancel={() => navigate(isEditing ? '/manage' : '/')}
      />
    </div>
  );
}
