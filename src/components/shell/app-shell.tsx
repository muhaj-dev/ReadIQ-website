'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, Suspense, useEffect } from 'react';

import { AppSidebar } from '@/components/shell/app-sidebar';
import { BottomTabBar } from '@/components/shell/bottom-tab-bar';
import { useOnboardingStore } from '@/store/use-onboarding-store';

/** In-app frame: desktop sidebar + content + mobile bottom bar. First-time visitors
 *  are sent through onboarding (the mobile app's splash routing). */
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const loaded = useOnboardingStore((s) => s.loaded);
  const completed = useOnboardingStore((s) => s.completed);

  useEffect(() => {
    if (loaded && !completed) router.replace('/welcome');
  }, [loaded, completed, router]);

  return (
    <div className="flex min-h-dvh bg-rq-surface">
      {/* usePathname needs a Suspense boundary under cacheComponents. */}
      <Suspense fallback={<div className="hidden w-64 shrink-0 lg:block" />}>
        <AppSidebar />
      </Suspense>
      <main className="min-w-0 flex-1">{loaded && completed ? children : null}</main>
      <Suspense fallback={null}>
        <BottomTabBar />
      </Suspense>
    </div>
  );
}
