import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/query-provider';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web App',
  description: 'Next.js app in the monorepo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <LanguageSwitcher />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
