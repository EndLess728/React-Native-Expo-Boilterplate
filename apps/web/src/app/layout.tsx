import type { Metadata } from 'next';
import { setupWebApiClient } from '@/lib/api-client';
import { QueryProvider } from '@/providers/query-provider';

setupWebApiClient();

export const metadata: Metadata = {
  title: 'Web App',
  description: 'Next.js app in the monorepo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
