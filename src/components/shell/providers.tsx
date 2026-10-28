'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { StoreInit } from '@/components/shell/store-init';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

/** App-wide client providers: theme (light/dark/system), tooltips, toasts, and the
 *  one-time store bootstrap from IndexedDB/localStorage. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <StoreInit />
        {children}
        <Toaster position="top-center" richColors />
      </TooltipProvider>
    </ThemeProvider>
  );
}
