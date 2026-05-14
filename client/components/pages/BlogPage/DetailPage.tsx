'use client';

import Link from 'next/link';
import { use, useMemo } from 'react';
import RichTextContent from '@/components/common/RichTextContent';
import { useContentPages } from '@/hooks/useContentPages';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';



type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const { items, loading } = useContentPages({ type: 'blog', onlyPublished: true });

  const post = useMemo(() => items.find((item) => item.slug === slug) ?? null, [items, slug]);

  if (loading) return <main className="bg-[#fbfaf7] px-4 py-10 sm:px-8 sm:py-12">Đang tải bài viết...</main>;

  if (!post) {
    return (
      <main className="bg-[#fbfaf7] px-4 py-12 sm:px-8 sm:py-16">
        <h1 className="text-4xl font-bold text-[#0B2D4D]">404</h1>
        <p className="mt-4 text-[#4b5563]">Không tìm thấy bài viết phù hợp.</p>
        <Link href="/blog" className="mt-8 inline-flex rounded-full bg-[#0B2D4D] px-5 py-3 text-white">Về trang Blog</Link>
      </main>
    );
  }

  return (
    <main className="bg-[#fbfaf7] px-4 py-10 sm:px-8 sm:py-12">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-[24px] border border-[#eee2d2] bg-white">
        <div className="h-[240px] w-full overflow-hidden sm:h-[320px] md:h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbnail_url || DEFAULT_PRODUCT_IMAGE} alt={post.title} className="h-full w-full object-cover" loading="eager" referrerPolicy="no-referrer" />
        </div>
        <div className="p-5 sm:p-7 md:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">Scentora Blog</p>
          <h1 className="mt-3 text-3xl font-bold text-[#0B2D4D] sm:text-4xl">{post.title}</h1>
          {post.summary ? <p className="mt-4 text-base text-[#5f6b7a] sm:text-lg">{post.summary}</p> : null}
          <RichTextContent value={post.content || post.summary} className="mt-8 break-words leading-8 text-[#334155]" />
        </div>
      </article>
    </main>
  );
}

