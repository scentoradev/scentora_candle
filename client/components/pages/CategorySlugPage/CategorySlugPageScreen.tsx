'use client';

import Link from 'next/link';
import { use, useMemo, useState } from 'react';
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
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

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

  const categoryProducts = useMemo(() => {
    if (!matchedCategory) return [];
    return products.filter((product) => product.category_id === matchedCategory.id);
  }, [products, matchedCategory]);

  const filteredProducts = useMemo(() => {
    const stockMatched = categoryProducts.filter((product) => {
      const productPrice = Number(product.price || 0);
      const productStock = Number(product.stock || 0);
      const byStock =
        stockFilter === 'all' ||
        (stockFilter === 'in_stock' && productStock > 0) ||
        (stockFilter === 'out_of_stock' && productStock <= 0);

      return byStock && productPrice >= 0;
    });

    if (priceSort === 'default') return stockMatched;

    return [...stockMatched].sort((a, b) => {
      const aPrice = Number(a.price || 0);
      const bPrice = Number(b.price || 0);
      return priceSort === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    });
  }, [categoryProducts, priceSort, stockFilter]);

  const isLoading = categoriesLoading || productsLoading || contentLoading;

  if (!isLoading && !matchedCategory && !matchedContent) {
    return (
      <main className="bg-[#fbfaf7] px-4 py-12 sm:px-8 sm:py-16">
        <h1 className="text-4xl font-bold text-[#0B2D4D]">404</h1>
        <p className="mt-4 text-[#4b5563]">Không tìm thấy nội dung phù hợp.</p>
      </main>
    );
  }

  if (matchedContent) {
    if (matchedContent.type === 'policy') {
      return (
        <main className="min-h-screen bg-[#fbfaf7]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-[220px_1fr]">
            <aside className="rounded-2xl bg-[#0B2D4D] p-4 text-white sm:p-5">
              <h2 className="mb-4 whitespace-nowrap text-2xl font-bold leading-tight text-[#D4AF37] sm:text-3xl">Chính sách</h2>
              <nav className="space-y-2">
                {policyItems.map((item) => (
                  <Link key={item.id} href={`/${item.slug}`} className={`block rounded-xl px-3 py-2 text-base font-medium transition sm:text-lg ${item.slug === matchedContent.slug ? 'bg-white/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                    {item.title}
                  </Link>
                ))}
              </nav>
            </aside>

            <article className="rounded-[24px] border border-[#eee2d2] bg-white p-5 sm:p-6 md:p-10">
              <RichTextContent
                value={matchedContent.content || matchedContent.summary}
                className="break-words text-[17px] leading-8 text-[#24364a] [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-[#0B2D4D] [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-[#0f3e66] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-[#1d4f7a] [&_p]:text-[17px] [&_p]:text-[#2a3d52]"
              />
            </article>
          </div>
        </main>
      );
    }

    if (matchedContent.type === 'about') {
      return (
        <main className="bg-[#fbfaf7] px-4 py-10 sm:px-8 sm:py-12">
          <article className="mx-auto max-w-5xl rounded-[24px] border border-[#eee2d2] bg-white p-5 sm:p-6 md:p-10">
            <RichTextContent value={matchedContent.content || matchedContent.summary} className="break-words leading-8 text-[#334155]" />
          </article>
        </main>
      );
    }

    return (
      <main className="bg-[#fbfaf7] px-4 py-10 sm:px-8 sm:py-12">
        <article className="mx-auto max-w-5xl rounded-[24px] border border-[#eee2d2] bg-white p-5 sm:p-6 md:p-10">
          <h1 className="text-3xl font-bold text-[#0B2D4D] sm:text-4xl">{matchedContent.title}</h1>
          {matchedContent.summary ? <p className="mt-4 text-lg text-[#5f6b7a]">{matchedContent.summary}</p> : null}
          <RichTextContent value={matchedContent.content || matchedContent.summary} className="mt-8 break-words leading-8 text-[#334155]" />
        </article>
      </main>
    );
  }

  return (
    <main className="bg-[#fbfaf7]">
      <section className="bg-[#0B2D4D] px-4 py-12 text-white sm:px-8 sm:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-6xl">{matchedCategory?.name ?? 'Danh mục'}</h1>
        <RichTextContent
          value={matchedCategory?.description}
          fallback="Bộ sưu tập sản phẩm theo danh mục."
          className="mt-4 max-w-3xl break-words text-white/80 [&_p]:my-2 [&_p]:text-lg [&_p]:leading-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold"
        />
      </section>

      <section className="px-4 py-10 sm:px-8 sm:py-12">
        {isLoading ? <p>Đang tải sản phẩm...</p> : null}
        {!isLoading ? (
          <div className="mb-6 grid gap-3 rounded-2xl border border-[#e7dccb] bg-white p-4 md:grid-cols-3">
            <select
              value={priceSort}
              onChange={(event) => setPriceSort(event.target.value as 'default' | 'asc' | 'desc')}
              className="rounded-xl border border-[#d5dce5] px-3 py-2"
            >
              <option value="default">Giá mặc định</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as 'all' | 'in_stock' | 'out_of_stock')}
              className="rounded-xl border border-[#d5dce5] px-3 py-2"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="in_stock">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setPriceSort('default');
                setStockFilter('all');
              }}
              className="rounded-xl border border-[#d8cdb9] px-3 py-2 font-semibold text-[#334155] hover:bg-[#f8f4ec]"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : null}

        {!isLoading && categoryProducts.length === 0 ? <p>Chưa có sản phẩm trong danh mục này.</p> : null}
        {!isLoading && categoryProducts.length > 0 && filteredProducts.length === 0 ? <p>Không có sản phẩm phù hợp bộ lọc.</p> : null}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <CategoryProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

