import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  isNoticeActive,
  isNoticeExpired,
  sortNoticesLatestFirst,
} from '../utils/dateUtils';
import {
  loadNoticesFromStorage,
  loadSettingsFromStorage,
  resetNoticesInStorage,
  saveNoticesToStorage,
  saveSettingsToStorage,
} from '../utils/storage';
import { DEPARTMENTS } from '../data/sampleData';

const NoticeContext = createContext(null);

export function NoticeProvider({ children }) {
  const [notices, setNotices] = useState(() => loadNoticesFromStorage());
  const [settings, setSettings] = useState(() => loadSettingsFromStorage());
  const [toasts, setToasts] = useState([]);
  const [activeModalNotice, setActiveModalNotice] = useState(null);

  useEffect(() => {
    saveNoticesToStorage(notices);
  }, [notices]);

  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        removeToast(id);
      }, 3600);
    },
    [removeToast]
  );

  const addNotice = useCallback(
    (noticeInput) => {
      const nowIso = new Date().toISOString();
      const newNotice = {
        ...noticeInput,
        id: `notice-${Date.now()}`,
        publishedAt: nowIso,
        updatedAt: nowIso,
      };
      setNotices((prev) => [newNotice, ...prev]);
      addToast(
        newNotice.status === 'Published'
          ? 'Notice published successfully.'
          : 'Notice saved as draft.',
        'success'
      );
      return newNotice;
    },
    [addToast]
  );

  const updateNotice = useCallback(
    (id, updates) => {
      const nowIso = new Date().toISOString();
      setNotices((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                updatedAt: nowIso,
              }
            : item
        )
      );
      setActiveModalNotice((prev) =>
        prev && prev.id === id ? { ...prev, ...updates, updatedAt: nowIso } : prev
      );
      addToast('Notice updated successfully.', 'success');
    },
    [addToast]
  );

  const deleteNotice = useCallback(
    (id) => {
      setNotices((prev) => prev.filter((item) => item.id !== id));
      setActiveModalNotice((prev) => (prev && prev.id === id ? null : prev));
      addToast('Notice deleted permanently.', 'info');
    },
    [addToast]
  );

  const togglePublishStatus = useCallback(
    (id) => {
      const target = notices.find((item) => item.id === id);
      if (!target) return;
      const nextStatus = target.status === 'Published' ? 'Draft' : 'Published';
      const nowIso = new Date().toISOString();
      setNotices((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: nextStatus,
                publishedAt: nextStatus === 'Published' ? nowIso : item.publishedAt,
                updatedAt: nowIso,
              }
            : item
        )
      );
      addToast(
        nextStatus === 'Published'
          ? 'Notice is now live for students.'
          : 'Notice moved to Drafts.',
        'success'
      );
    },
    [notices, addToast]
  );

  const setRole = useCallback(
    (nextRole) => {
      setSettings((prev) => ({ ...prev, role: nextRole }));
      addToast(
        nextRole === 'admin'
          ? 'Switched to Admin View (Demo Mode).'
          : 'Switched to Student View.',
        'info'
      );
    },
    [addToast]
  );

  const updateSettings = useCallback(
    (partial) => {
      setSettings((prev) => ({ ...prev, ...partial }));
      addToast('Preferences saved.', 'success');
    },
    [addToast]
  );

  const resetDemoData = useCallback(() => {
    const fresh = resetNoticesInStorage();
    setNotices(fresh);
    addToast('Sample notices restored to default demo state.', 'info');
  }, [addToast]);

  const clearExpiredNotices = useCallback(() => {
    const expiredCount = notices.filter((n) => isNoticeExpired(n.expiryDate)).length;
    if (expiredCount === 0) {
      addToast('No expired notices to remove.', 'info');
      return;
    }
    setNotices((prev) => prev.filter((n) => !isNoticeExpired(n.expiryDate)));
    addToast(`Cleared ${expiredCount} expired notice${expiredCount > 1 ? 's' : ''}.`, 'success');
  }, [notices, addToast]);

  const sortedNotices = useMemo(() => sortNoticesLatestFirst(notices), [notices]);

  const stats = useMemo(() => {
    const total = notices.length;
    const active = notices.filter((n) => isNoticeActive(n)).length;
    const expired = notices.filter((n) => isNoticeExpired(n.expiryDate)).length;
    const drafts = notices.filter((n) => n.status === 'Draft').length;
    return {
      total,
      active,
      expired,
      drafts,
      totalDepartments: DEPARTMENTS.length,
    };
  }, [notices]);

  const value = {
    notices: sortedNotices,
    stats,
    settings,
    toasts,
    activeModalNotice,
    setActiveModalNotice,
    addNotice,
    updateNotice,
    deleteNotice,
    togglePublishStatus,
    setRole,
    updateSettings,
    resetDemoData,
    clearExpiredNotices,
    addToast,
    removeToast,
  };

  return <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>;
}

export function useNotices() {
  const ctx = useContext(NoticeContext);
  if (!ctx) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  return ctx;
}
