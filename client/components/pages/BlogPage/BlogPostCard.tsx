import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';
import { getImageCandidates } from '@/utils/image';

type BlogPostCardProps = {
  title: string;
  desc: string;
  image: string;
  slug: string;
};

export default function BlogPostCard({ title, desc, image, slug }: BlogPostCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const candidates = useMemo(() => getImageCandidates(image || DEFAULT_PRODUCT_IMAGE), [image]);
  const imageUrl = candidates[imageIndex] || DEFAULT_PRODUCT_IMAGE;

  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div className="h-[220px] w-full overflow-hidden sm:h-[260px] md:h-[280px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            setImageIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
          }}
        />
      </div>

      <div className="p-5 sm:p-7">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#D4AF37]">Blog</p>
        <h2 className="mb-4 line-clamp-2 text-2xl font-bold text-[#0B2D4D]">{title}</h2>
        <p className="line-clamp-3 min-h-20 leading-7 text-gray-600">{desc}</p>
        <Link href={`/blog/${slug}`} className="mt-6 inline-flex rounded-full border border-[#0B2D4D] px-6 py-3 font-semibold text-[#0B2D4D]">Đọc thêm</Link>
      </div>
    </article>
  );
}
