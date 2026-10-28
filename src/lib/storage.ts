// Tiny AsyncStorage-shaped wrapper over localStorage, so the stores ported from
// the mobile app keep their `await storage.getItem(...)` calls unchanged.
// Every access is guarded: private windows / blocked storage just behave empty.

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage full or blocked — the in-memory store state still drives the UI.
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing to clean up.
    }
  },
};

/** Every localStorage key the app writes — used by "Delete all my data". */
export const STORAGE_KEYS = [
  'onboarding_complete',
  'user_profile',
  'app_settings',
  'podcast_voice_prefs',
] as const;
