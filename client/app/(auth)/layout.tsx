import type { LayoutProps } from '@/components/layouts/shared';

export default function AuthLayout({ children }: LayoutProps) {
  return <div className="min-h-screen bg-[#f4f1ea] text-[#14213d]">{children}</div>;
}
