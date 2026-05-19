'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import RichTextContent from '@/components/common/RichTextContent';
import { getImageCandidates } from '@/utils/image';

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
  const [imageIndex, setImageIndex] = useState(0);
  const candidates = useMemo(() => getImageCandidates(image), [image]);
  const activeImage = candidates[imageIndex] || '';
  const shouldShowImage = Boolean(activeImage);

  return (
    <Link
      href={`/san_pham/${slug}`}
      key={id}
      className="group block overflow-hidden rounded-[28px] border border-[#e8decd] bg-white shadow-[0_8px_24px_rgba(11,45,77,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(11,45,77,0.14)]"
    >
      <div className="relative h-[260px] overflow-hidden sm:h-[300px] md:h-[320px]">
        {shouldShowImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage}
            alt={name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => {
              setImageIndex((prev) => {
                if (prev + 1 < candidates.length) return prev + 1;
                return prev;
              });
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f6efe3] via-[#f9f5ee] to-[#efe4d3] px-6 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[#0B2D4D]/55">
            Hình ảnh sản phẩm
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[#0B2D4D] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-lg">{tag}</span>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <div>
          <h3 className="mb-2 min-h-[42px] text-xl font-bold leading-tight text-[#1f1f1f] sm:min-h-[52px] sm:text-2xl md:min-h-[56px] md:text-[32px]">{name}</h3>
          <RichTextContent
            value={shortDescription}
            fallback="Sản phẩm thủ công cao cấp cho không gian sống."
            className="line-clamp-3 min-h-16 text-[15px] leading-7 text-[#5f6b7a]"
          />
        </div>

        <div className="h-px w-full bg-gradient-to-r from-[#d9c7a3] via-[#f1e6d3] to-transparent" />

        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-extrabold text-[#0B2D4D] sm:text-3xl">{price}</p>
          <span className="text-sm font-semibold text-[#0B2D4D]/70">Nhấn để xem</span>
        </div>
      </div>
    </Link>
  );
}
