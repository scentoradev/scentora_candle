import Link from 'next/link';
import RichTextContent from '@/components/common/RichTextContent';

type MainProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: string;
  tag: string;
  image: string;
  shortDescription?: string;
};

export default function MainProductCard({ id, slug, name, price, tag, image, shortDescription }: MainProductCardProps) {
  return (
    <Link
      href={`/san_pham/${slug}`}
      key={id}
      className="group block overflow-hidden rounded-[28px] border border-[#e8decd] bg-white shadow-[0_8px_24px_rgba(11,45,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(11,45,77,0.14)]"
    >
      <div className="relative h-[320px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#0B2D4D] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-lg">{tag}</span>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h3 className="mb-2 min-h-[56px] text-3xl font-bold leading-tight text-[#1f1f1f] md:text-[32px]">{name}</h3>
          <RichTextContent
            value={shortDescription}
            fallback="Sản phẩm thủ công cao cấp cho không gian sống."
            className="line-clamp-3 min-h-16 text-[15px] leading-7 text-[#5f6b7a]"
          />
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#d9c7a3] via-[#f1e6d3] to-transparent" />

        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-extrabold text-[#0B2D4D]">{price}</p>
          <span className="text-sm font-semibold text-[#0B2D4D]/70">Nhấn để xem</span>
        </div>
      </div>
    </Link>
  );
}
