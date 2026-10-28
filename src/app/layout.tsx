import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Manrope } from 'next/font/google';

import { Providers } from '@/components/shell/providers';

import './globals.css';

// Design fonts from the mobile app: Manrope (headings) · Hanken Grotesk (body).
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], weight: ['500', '600', '700', '800'] });
const hanken = Hanken_Grotesk({ variable: '--font-hanken', subsets: ['latin'], style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: {
    default: 'readIQ — the study partner that only answers from your notes',
    template: '%s · readIQ',
  },
  description:
    'readIQ remembers your notes and answers questions using only what you saved — with a "From your notes" tag on every answer. Quizzes, deadlines, and a podcast of your own material.',
  applicationName: 'readIQ',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f9ff' },
    { media: '(prefers-color-scheme: dark)', color: '#12121f' },
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${hanken.variable} h-full`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
