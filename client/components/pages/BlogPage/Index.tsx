'use client';

import BlogPostCard from './BlogPostCard';
import { useContentPages } from '@/hooks/useContentPages';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';



export default function BlogPage() {
  const { items, loading } = useContentPages({ type: 'blog', onlyPublished: true });

  return (
    <main className="bg-[#fbfaf7]">
      <section className="bg-[#0B2D4D] px-8 py-20 text-white">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">Scentora Journal</p>
        <h1 className="text-5xl font-bold">Blog</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
          Những chia sẻ nhỏ về nến thơm, mùi hương, decor và cách chăm sóc
          không gian sống.
        </p>
      </section>

      <section className="px-8 py-16">
        {loading ? <p>Đang tải bài viết...</p> : null}
        {!loading && items.length === 0 ? <p>Chưa có bài viết nào.</p> : null}
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((post) => (
            <BlogPostCard
              key={post.id}
              title={post.title}
              desc={post.summary || 'Bài viết mới từ Scentora.'}
              image={post.thumbnail_url || DEFAULT_PRODUCT_IMAGE}
              slug={post.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

