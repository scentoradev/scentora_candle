'use client';

import Link from 'next/link';
import { use, useMemo } from 'react';
import RichTextContent from '@/components/common/RichTextContent';
import { useCategories } from '@/hooks/useCategories';
import { useContentPages } from '@/hooks/useContentPages';
import { useProducts } from '@/hooks/useProducts';
import { normalizeSlug } from '@/utils/slug';
import CategoryProductCard from './CategoryProductCard';

type CategorySlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function CategorySlugPage({ params }: CategorySlugPageProps) {
  const { slug } = use(params);
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();
  const { items: contentPages, loading: contentLoading } = useContentPages({ onlyPublished: true });

  const matchedCategory = useMemo(() => {
    const target = normalizeSlug(slug);
    return categories.find((category) => normalizeSlug(category.slug) === target) ?? null;
  }, [categories, slug]);

  const matchedContent = useMemo(() => {
    const target = normalizeSlug(slug);
    return contentPages.find((item) => normalizeSlug(item.slug) === target) ?? null;
  }, [contentPages, slug]);

  const policyItems = useMemo(
    () => contentPages.filter((item) => item.type === 'policy').sort((a, b) => a.sort_order - b.sort_order),
    [contentPages],
  );

  const filteredProducts = useMemo(() => {
    if (!matchedCategory) return [];
    return products.filter((product) => product.category_id === matchedCategory.id);
  }, [products, matchedCategory]);

  const isLoading = categoriesLoading || productsLoading || contentLoading;

  if (!isLoading && !matchedCategory && !matchedContent) {
    return (
      <main className="bg-[#fbfaf7] px-8 py-16">
        <h1 className="text-4xl font-bold text-[#0B2D4D]">404</h1>
        <p className="mt-4 text-[#4b5563]">Không tìm thấy nội dung phù hợp.</p>
      </main>
    );
  }

  if (matchedContent) {
    if (matchedContent.type === 'policy') {
      return (
        <main className="min-h-screen bg-[#fbfaf7]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
            <aside className="rounded-[20px] bg-[#0B2D4D] p-6 text-white">
              <h2 className="mb-6 text-5xl font-bold leading-tight text-[#D4AF37]">Chính sách</h2>
              <nav className="space-y-3">
                {policyItems.map((item) => (
                  <Link key={item.id} href={`/${item.slug}`} className={`block rounded-lg px-3 py-2 text-3xl font-medium transition ${item.slug === matchedContent.slug ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                    {item.title}
                  </Link>
                ))}
              </nav>
            </aside>

            <article className="rounded-[24px] border border-[#eee2d2] bg-white p-8 md:p-10">
              <h1 className="text-4xl font-bold text-[#0B2D4D]">{matchedContent.title}</h1>
              {matchedContent.summary ? <p className="mt-4 text-lg text-[#5f6b7a]">{matchedContent.summary}</p> : null}
              <RichTextContent value={matchedContent.content || matchedContent.summary} className="mt-8 break-words leading-8 text-[#334155]" />
            </article>
          </div>
        </main>
      );
    }

    return (
      <main className="bg-[#fbfaf7] px-8 py-12">
        <article className="mx-auto max-w-5xl rounded-[24px] border border-[#eee2d2] bg-white p-8 md:p-10">
          <h1 className="text-4xl font-bold text-[#0B2D4D]">{matchedContent.title}</h1>
          {matchedContent.summary ? <p className="mt-4 text-lg text-[#5f6b7a]">{matchedContent.summary}</p> : null}
          <RichTextContent value={matchedContent.content || matchedContent.summary} className="mt-8 break-words leading-8 text-[#334155]" />
        </article>
      </main>
    );
  }

  return (
    <main className="bg-[#fbfaf7]">
      <section className="bg-[#0B2D4D] px-8 py-16 text-white">
        <h1 className="text-4xl font-bold md:text-6xl">{matchedCategory?.name ?? 'Danh mục'}</h1>
        <p className="mt-4 max-w-3xl text-white/80">{matchedCategory?.description || 'Bộ sưu tập sản phẩm theo danh mục.'}</p>
      </section>

      <section className="px-8 py-12">
        {isLoading ? <p>Đang tải sản phẩm...</p> : null}
        {!isLoading && filteredProducts.length === 0 ? <p>Chưa có sản phẩm phù hợp.</p> : null}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <CategoryProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

