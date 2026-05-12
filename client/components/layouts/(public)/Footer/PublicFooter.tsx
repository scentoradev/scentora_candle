import Link from 'next/link';
import { FaTiktok } from 'react-icons/fa';

const categoryLinks = [
  { label: 'Nến thơm', href: '/nen_thom' },
  { label: 'Tinh dầu', href: '/tinh_dau' },
  { label: 'Set quà tặng', href: '/set_qua_tang' },
  { label: 'Ly sứ decor', href: '/ly_su' },
  { label: 'Phụ kiện', href: '/phu_kien' },
];

const policyLinks = [
  { label: 'Bảo mật', href: '/gioi_thieu' },
  { label: 'Đổi trả', href: '/gioi_thieu' },
  { label: 'Vận chuyển', href: '/gioi_thieu' },
  { label: 'Điều khoản', href: '/gioi_thieu' },
  { label: 'Liên hệ', href: '/blog' },
];

const footerLinkClass = 'hover:text-[#D4AF37] transition';

export default function PublicFooter() {
  return (
    <footer className="overflow-hidden bg-[#0B2D4D] text-white">
      <div className="grid grid-cols-1 gap-14 border-b border-white/10 px-8 py-20 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#08243d] text-3xl font-serif text-[#D4AF37] shadow-lg">
              S
            </div>

            <div>
              <h2 className="text-3xl font-bold">Scentora Candle</h2>
              <p className="mt-1 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">Xưởng hương thơm cao cấp</p>
            </div>
          </div>

          <p className="max-w-md text-[17px] leading-8 text-white/75">
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
          <h3 className="mb-8 text-2xl font-bold text-[#D4AF37]">Danh mục</h3>
          <ul className="space-y-5 text-[17px] text-white/75">
            {categoryLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLinkClass}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-8 text-2xl font-bold text-[#D4AF37]">Chính sách</h3>
          <ul className="space-y-5 text-[17px] text-white/75">
            {policyLinks.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link href={item.href} className={footerLinkClass}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-8 text-2xl font-bold text-[#D4AF37]">Liên hệ</h3>
          <div className="space-y-6 text-[17px] text-white/75">
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

      <div className="flex flex-col items-center justify-between gap-4 px-8 py-6 text-sm text-white/50 md:flex-row">
        <p>© 2026 Scentora Candle. Đã đăng ký mọi quyền.</p>
        <p>Thủ công tinh tế, ấm áp trong từng chi tiết.</p>
      </div>
    </footer>
  );
}
