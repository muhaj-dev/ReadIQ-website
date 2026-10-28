import { Suspense } from 'react';

import { AppShell } from '@/components/shell/app-shell';

// In-app pages render client-side from the student's own IndexedDB data, so there is
// no server content to validate for instant navigation — opt the group out.
export const instant = false;

/** Every in-app route (Home, Ask, Memory, notes, quiz, deadlines, settings …).
 *  Suspense lets client pages read useSearchParams/useParams under cacheComponents. */
export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <AppShell>
      <Suspense fallback={null}>{children}</Suspense>
    </AppShell>
  );
}
