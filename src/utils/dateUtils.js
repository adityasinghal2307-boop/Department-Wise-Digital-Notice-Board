/**
 * Returns local calendar date as YYYY-MM-DD for consistent expiry comparisons.
 */
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks whether a YYYY-MM-DD expiry date is strictly before today.
 */
export const isNoticeExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return expiryDate < getTodayDateString();
};

/**
 * Determines whether a notice is currently active (published and not expired).
 */
export const isNoticeActive = (notice) => {
  if (!notice) return false;
  return notice.status === 'Published' && !isNoticeExpired(notice.expiryDate);
};

/**
 * Computes human-readable lifecycle state: 'Active' | 'Expired' | 'Draft'.
 */
export const getNoticeLifecycleStatus = (notice) => {
  if (notice.status === 'Draft') return 'Draft';
  if (isNoticeExpired(notice.expiryDate)) return 'Expired';
  return 'Active';
};

/**
 * Formats an ISO timestamp or YYYY-MM-DD string into a clean readable date.
 */
export const formatDisplayDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  const parsed = dateInput.length === 10 ? new Date(`${dateInput}T00:00:00`) : new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return dateInput;
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats relative time such as "Today", "Yesterday", or "3 days ago".
 */
export const formatRelativeTime = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfTarget) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDisplayDate(isoDate);
};

/**
 * Sorts notices with the latest published timestamp first.
 */
export const sortNoticesLatestFirst = (notices) => {
  return [...notices].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
};
