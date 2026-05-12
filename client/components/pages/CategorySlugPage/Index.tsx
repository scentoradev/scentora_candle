'use client';

import { use, useMemo } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import CategoryProductCard from './CategoryProductCard';

type CategorySlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function normalizeSlug(value: string) {
  return value.toLowerCase().replace(/_/g, '-');
}

export default function CategorySlugPage({ params }: CategorySlugPageProps) {
  const { slug } = use(params);
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();

  const matchedCategory = useMemo(() => {
    const target = normalizeSlug(slug);
    return categories.find((category) => normalizeSlug(category.slug) === target) ?? null;
  }, [categories, slug]);

  const filteredProducts = useMemo(() => {
    if (!matchedCategory) return [];
    return products.filter((product) => product.category_id === matchedCategory.id);
  }, [products, matchedCategory]);

  const isLoading = categoriesLoading || productsLoading;

  if (!isLoading && !matchedCategory) {
    return (
      <main className="bg-[#fbfaf7] px-8 py-16">
        <h1 className="text-4xl font-bold text-[#0B2D4D]">404</h1>
        <p className="mt-4 text-[#4b5563]">Không tìm thấy danh mục phù hợp.</p>
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
