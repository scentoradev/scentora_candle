import Link from 'next/link';
import type { LayoutProps } from '@/components/layouts/shared';

const dashboardLinks = [
  { href: '/', label: 'Về trang chủ', kind: 'outline' as const },
  { href: '/admin', label: 'Trang quản trị', kind: 'outline' as const },
  { href: '/admin/thong_ke', label: 'Thống kê', kind: 'solid' as const },
];

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#14213d]">
      <header className="sticky top-0 z-40 border-b border-[#d8cdb9] bg-[#fffaf2]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9a7a46]">Scentora Dashboard</p>
            <h1 className="text-xl font-bold">Trang quản trị</h1>
          </div>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.kind === 'solid'
                    ? 'rounded-full bg-[#14213d] px-4 py-2 text-white hover:bg-[#1f3158]'
                    : 'rounded-full border border-[#d8cdb9] px-4 py-2 hover:bg-[#f6efe3]'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>

      <footer className="mt-12 border-t border-[#d8cdb9] bg-[#fffaf2]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-5 text-sm text-[#6b7280] md:flex-row md:items-center md:justify-between">
          <p>Trung tâm quản trị Scentora Candle</p>
          <p>Quản lý sản phẩm, danh mục, hình ảnh và tồn kho</p>
        </div>
      </footer>
    </div>
  );
}
