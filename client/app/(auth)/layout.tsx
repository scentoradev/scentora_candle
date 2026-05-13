import Link from 'next/link';
import type { LayoutProps } from '@/components/layouts/shared';

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#14213d]">
      <header className="border-b border-[#d8cdb9] bg-[#fffaf2]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9a7a46]">Scentora Auth</p>
            <h1 className="text-xl font-bold text-[#0B2D4D]">Đăng nhập quản trị</h1>
          </div>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/" className="rounded-full border border-[#d8cdb9] px-4 py-2 hover:bg-[#f6efe3]">Trang chủ</Link>
            <Link href="/blog" className="rounded-full border border-[#d8cdb9] px-4 py-2 hover:bg-[#f6efe3]">Blog</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
