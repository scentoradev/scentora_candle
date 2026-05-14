'use client';

import { useMemo } from 'react';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';
import { formatVnd } from '@/utils/format';
import { useCategories } from '../../../hooks/useCategories';
import { useProducts } from '../../../hooks/useProducts';
import MainProductCard from './MainProductCard';

function shuffleArray<T>(items: T[]) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MainPage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const featuredCandleProducts = useMemo(() => {
    const candleCategoryIds = new Set(
      categories
        .filter((category) => category.slug.toLowerCase().includes('nen'))
        .map((category) => category.id),
    );

    const sourceProducts =
      candleCategoryIds.size > 0
        ? products.filter((product) => product.category_id && candleCategoryIds.has(product.category_id))
        : products;

    return shuffleArray(sourceProducts).slice(0, 4).map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      shortDescription: item.short_description || item.description || '',
      price: formatVnd(item.price),
      tag: 'Nến thơm',
      image: item.thumbnail_url || DEFAULT_PRODUCT_IMAGE,
    }));
  }, [categories, products]);

  const randomCategorySections = useMemo(() => {
    const candleCategoryIds = new Set(
      categories
        .filter((category) => category.slug.toLowerCase().includes('nen'))
        .map((category) => category.id),
    );

    const productsByCategory = new Map<string, typeof products>();
    products.forEach((product) => {
      if (!product.category_id || candleCategoryIds.has(product.category_id)) return;
      const bucket = productsByCategory.get(product.category_id) ?? [];
      bucket.push(product);
      productsByCategory.set(product.category_id, bucket);
    });

    const categoryIds = Array.from(productsByCategory.keys());
    return shuffleArray(categoryIds).slice(0, 2).map((categoryId) => {
      const randomProducts = shuffleArray(productsByCategory.get(categoryId) ?? []).slice(0, 4);
      return {
        categoryId,
        categoryName: categoryNameById.get(categoryId) || 'Danh mục khác',
        categorySlug: categories.find((category) => category.id === categoryId)?.slug || '',
        products: randomProducts.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          shortDescription: item.short_description || item.description || '',
          price: formatVnd(item.price),
          tag: 'Gợi ý',
          image: item.thumbnail_url || DEFAULT_PRODUCT_IMAGE,
        })),
      };
    });
  }, [categories, products, categoryNameById]);

  const displayCategories = useMemo(
    () => shuffleArray(categories).slice(0, 3).map((category) => category.name),
    [categories],
  );

  return (
    <main className="bg-[#fbfaf7]">
      <section className="grid min-h-[560px] grid-cols-1 md:min-h-[680px] md:grid-cols-2">
        <div className="flex items-center bg-[#0B2D4D] px-5 py-14 text-white sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-xl">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Scentora Candle</p>
            <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-7xl">Thắp sáng không gian sống</h1>
            <p className="mb-9 text-base leading-7 text-gray-200 sm:text-lg sm:leading-8">Bộ sưu tập nến thơm cao cấp cho không gian sống thư giãn, ấm áp và sang trọng.</p>
          </div>
        </div>

        <div
          className="min-h-[520px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(11,45,77,0.08), rgba(11,45,77,0.08)), url('https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1400')",
          }}
        />
      </section>

      <section className="border-b border-[#eadfce] bg-[#f4efe7] px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.25em] text-[#0B2D4D]">Hương thơm cao cấp cho không gian sống</p>
          <div className="flex gap-3 text-sm">
            {displayCategories.map((categoryName) => (
              <button key={categoryName} className="rounded-full border border-[#0B2D4D]/20 px-5 py-2">{categoryName}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 sm:px-8 sm:py-16 md:px-10 md:py-20 lg:px-14">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">Bộ sưu tập đặc trưng</p>
            <h2 className="text-3xl font-bold text-[#0B2D4D] sm:text-4xl md:text-5xl">Nến thơm nổi bật</h2>
          </div>
        </div>

        {loading ? <p>Đang tải sản phẩm...</p> : null}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {featuredCandleProducts.map((product) => (
            <MainProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {randomCategorySections.map((section) => (
        <section key={section.categoryId} className="w-full px-4 py-10 sm:px-8 md:px-10 lg:px-14">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">Khám phá thêm</p>
              <h2 className="text-3xl font-bold text-[#0B2D4D] md:text-4xl">{section.categoryName}</h2>
            </div>
            {section.categorySlug ? (
              <a
                href={`/${section.categorySlug}`}
                className="inline-flex items-center rounded-full border border-[#0B2D4D] px-5 py-2 text-sm font-semibold text-[#0B2D4D] transition hover:bg-[#0B2D4D] hover:text-white"
              >
                Xem thêm danh mục
              </a>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {section.products.map((product) => (
              <MainProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
