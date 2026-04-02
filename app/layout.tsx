import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'MCP UI Dashboard',
  description: 'Standalone UI dashboard for MCP database exploration.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
