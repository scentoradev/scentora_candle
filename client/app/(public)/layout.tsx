import type { Metadata } from 'next';

import PublicSetup from '@/components/layouts/(public)/PublicSetup';
import type { LayoutProps } from '@/components/layouts/shared';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Scentora Candle',
  description: 'Luxury candle website.',
};

export default function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f6f4ef] text-neutral-900">
      <div className="flex min-h-screen w-full flex-col bg-white">
        <PublicSetup>{children}</PublicSetup>
      </div>
    </div>
  );
}
