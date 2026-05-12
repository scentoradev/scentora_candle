import type { Metadata } from 'next';
import './globals.css';
import type { LayoutProps } from '@/components/layouts/shared';

export const metadata: Metadata = {
  title: 'Scentora Candle',
  description: 'Website Scentora Candle',
};

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
