import Link from 'next/link';

type BlogPostCardProps = {
  title: string;
  desc: string;
  image: string;
  slug: string;
};

export default function BlogPostCard({ title, desc, image, slug }: BlogPostCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div className="h-[280px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
      </div>

      <div className="p-7">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#D4AF37]">Blog</p>
        <h2 className="mb-4 line-clamp-2 text-2xl font-bold text-[#0B2D4D]">{title}</h2>
        <p className="line-clamp-3 min-h-20 leading-7 text-gray-600">{desc}</p>
        <Link href={`/blog/${slug}`} className="mt-6 inline-flex rounded-full border border-[#0B2D4D] px-6 py-3 font-semibold text-[#0B2D4D]">Đọc thêm</Link>
      </div>
    </article>
  );
}
