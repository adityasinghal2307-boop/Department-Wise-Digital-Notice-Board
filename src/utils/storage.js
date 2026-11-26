import { createInitialNotices, DEFAULT_SETTINGS } from '../data/sampleData';

const NOTICES_STORAGE_KEY = 'dept_notice_board_notices_v1';
const SETTINGS_STORAGE_KEY = 'dept_notice_board_settings_v1';

export const loadNoticesFromStorage = () => {
  try {
    const raw = localStorage.getItem(NOTICES_STORAGE_KEY);
    if (!raw) {
      const seed = createInitialNotices();
      localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const seed = createInitialNotices();
      localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch {
    return createInitialNotices();
  }
};

export const saveNoticesToStorage = (notices) => {
  try {
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
  } catch (error) {
    console.error('Failed to persist notices in localStorage:', error);
  }
};

export const resetNoticesInStorage = () => {
  const seed = createInitialNotices();
  saveNoticesToStorage(seed);
  return seed;
};

export const loadSettingsFromStorage = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return { ...DEFAULT_SETTINGS };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to persist settings in localStorage:', error);
  }
};
