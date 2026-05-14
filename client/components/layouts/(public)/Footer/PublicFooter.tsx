'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaTiktok } from 'react-icons/fa';
import { useContentPages } from '@/hooks/useContentPages';

const categoryLinks = [
  { label: 'Nến thơm', href: '/nen_thom' },
  { label: 'Tinh dầu', href: '/tinh_dau' },
  { label: 'Set quà tặng', href: '/set_qua_tang' },
  { label: 'Ly sứ decor', href: '/ly_su' },
  { label: 'Phụ kiện', href: '/phu_kien' },
];

const fallbackPolicyLinks = [
  { label: 'Bảo mật', href: '/gioi_thieu' },
  { label: 'Đổi trả', href: '/gioi_thieu' },
  { label: 'Vận chuyển', href: '/gioi_thieu' },
  { label: 'Điều khoản', href: '/gioi_thieu' },
  { label: 'Liên hệ', href: '/blog' },
];

const footerLinkClass = 'hover:text-[#D4AF37] transition';

export default function PublicFooter() {
  const { items: policyItems } = useContentPages({ type: 'policy', onlyPublished: true });

  const policyLinks =
    policyItems.length > 0
      ? policyItems
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => ({
            label: item.title,
            href: `/${item.slug}`,
          }))
      : fallbackPolicyLinks;

  return (
    <footer className="overflow-hidden bg-[#0B2D4D] text-white">
      <div className="grid grid-cols-1 gap-10 border-b border-white/10 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-12 md:py-16 xl:grid-cols-4 xl:px-8 xl:py-20">
        <div>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#08243d] shadow-lg">
              <Image src="/logo.png" alt="Scentora Candle logo" width={80} height={80} className="h-full w-full object-cover" />
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Scentora Candle</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#D4AF37] sm:text-sm sm:tracking-[0.25em]">Xưởng hương thơm cao cấp</p>
            </div>
          </div>

          <p className="max-w-md text-[15px] leading-7 text-white/75 sm:text-[17px] sm:leading-8">
            Thắp sáng không gian, lan tỏa yêu thương. Bộ sưu tập nến thơm và tinh dầu mang đến cảm giác thư giãn, sang trọng và đầy cảm xúc cho từng khoảnh khắc.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="https://www.facebook.com/share/1CnLbvJRMK/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-xl transition hover:bg-[#D4AF37] hover:text-[#0B2D4D]"
            >
              f
            </a>

            <a
              href="https://www.tiktok.com/@scentoracandle?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-xl transition hover:bg-[#D4AF37] hover:text-[#0B2D4D]"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D4AF37] sm:mb-8 sm:text-2xl">Danh mục</h3>
          <ul className="space-y-4 text-[15px] text-white/75 sm:space-y-5 sm:text-[17px]">
            {categoryLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLinkClass}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D4AF37] sm:mb-8 sm:text-2xl">Chính sách</h3>
          <ul className="space-y-4 text-[15px] text-white/75 sm:space-y-5 sm:text-[17px]">
            {policyLinks.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link href={item.href} className={footerLinkClass}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-bold text-[#D4AF37] sm:mb-8 sm:text-2xl">Liên hệ</h3>
          <div className="space-y-5 text-[15px] text-white/75 sm:space-y-6 sm:text-[17px]">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/40">Hotline</p>
              <p className="text-xl font-semibold text-white">093 896 20 62</p>
            </div>

            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/40">Email</p>
              <p>scentoracandle@gmail.com</p>
            </div>

            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/40">Địa chỉ</p>
              <p>102/135 Lê Văn Thọ, Hồ Chí Minh</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-white/50 sm:px-6 sm:text-sm md:flex-row md:text-left xl:px-8">
        <p>© 2026 Scentora Candle. Đã đăng ký mọi quyền.</p>
        <p>Thủ công tinh tế, ấm áp trong từng chi tiết.</p>
      </div>
    </footer>
  );
}
