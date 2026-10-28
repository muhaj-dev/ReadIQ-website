// The app's navigation. Mobile shows the mobile app's bottom bar exactly
// (Home · Ask AI · [+] · Memory · Profile); desktop's sidebar adds the screens the
// phone reaches from Home (Quiz, Deadlines) plus Settings.

import type { AppIconName } from '@/components/ui/app-icon';

export type NavItem = { href: string; label: string; icon: AppIconName };

/** The four bottom-bar tabs (the + Add button sits between Ask AI and Memory). */
export const TAB_ITEMS: NavItem[] = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/ask', label: 'Ask AI', icon: 'auto-awesome' },
  { href: '/memory', label: 'Memory', icon: 'psychology' },
  { href: '/profile', label: 'Profile', icon: 'person' },
];

/** Desktop sidebar — the tabs plus the study tools. */
export const SIDEBAR_ITEMS: NavItem[] = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/ask', label: 'Ask AI', icon: 'auto-awesome' },
  { href: '/memory', label: 'Memory', icon: 'psychology' },
  { href: '/quiz', label: 'Quiz', icon: 'quiz' },
  { href: '/deadlines', label: 'Deadlines', icon: 'calendar-month' },
  { href: '/profile', label: 'Profile', icon: 'person' },
];

/** Is `href` the active section for `pathname`? (/note/… counts as Memory.) */
export function isActive(pathname: string, href: string): boolean {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  if (href === '/memory' && pathname.startsWith('/note/')) return true;
  if (href === '/ask' && pathname.startsWith('/ask-history')) return true;
  if (href === '/profile' && pathname.startsWith('/settings')) return true;
  return false;
}

/** Routes that show the mobile bottom bar (the mobile app's tab screens; Ask is full-bleed). */
export function showsBottomBar(pathname: string): boolean {
  return ['/home', '/memory', '/profile'].includes(pathname);
}
