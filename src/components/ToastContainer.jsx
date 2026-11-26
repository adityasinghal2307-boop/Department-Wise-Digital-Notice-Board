import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotices();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    if (type === 'error') return <AlertCircle size={18} color="#f87171" />;
    if (type === 'info') return <Info size={18} color="#60a5fa" />;
    return <CheckCircle2 size={18} color="#34d399" />;
  };

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          {getIcon(toast.type)}
          <span>{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
