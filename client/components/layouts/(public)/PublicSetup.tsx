'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import PublicFooter from '@/components/layouts/(public)/Footer/PublicFooter';
import PublicNavbar from '@/components/layouts/(public)/Navbar/PublicNavbar';

type PublicSetupProps = {
  children: ReactNode;
};

export default function PublicSetup({ children }: PublicSetupProps) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        router.push('/admin/login');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router]);

  return (
    <div className="min-h-screen w-full">
      <PublicNavbar />
      <main className="w-full">{children}</main>
      <PublicFooter />
    </div>
  );
}

