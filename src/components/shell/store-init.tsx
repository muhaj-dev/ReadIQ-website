'use client';

import { useEffect } from 'react';

import { useChatStore } from '@/store/use-chat-store';
import { useDeadlinesStore } from '@/store/use-deadlines-store';
import { useNotesStore } from '@/store/use-notes-store';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useQuizStore } from '@/store/use-quiz-store';
import { useSettingsStore } from '@/store/use-settings-store';
import { useSubjectsStore } from '@/store/use-subjects-store';
import { useUserStore } from '@/store/use-user-store';

/** Load every store from IndexedDB/localStorage once, as early as possible
 *  (the web version of the mobile app's root-layout init effect). Renders nothing. */
export function StoreInit() {
  useEffect(() => {
    useNotesStore.getState().init();
    useSubjectsStore.getState().init();
    useOnboardingStore.getState().init();
    useChatStore.getState().init();
    useQuizStore.getState().init();
    useDeadlinesStore.getState().init();
    useSettingsStore.getState().init();
    // Count the streak only after the profile loads, or a first tick overwrites lastActiveDate.
    useUserStore.getState().init().then(() => useUserStore.getState().recordDailyActivity());
  }, []);
  return null;
}
