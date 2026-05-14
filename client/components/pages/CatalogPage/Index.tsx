'use client';

import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import CatalogProductCard from './CatalogProductCard';

type CatalogPageProps = {
  title: string;
  subtitle: string;
  keyword?: string;
};

export default function CatalogPage({ title, subtitle, keyword }: CatalogPageProps) {
  const { products, loading } = useProducts();

  const filtered = useMemo(() => {
    if (!keyword) return products;
    const key = keyword.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(key) || (p.description || '').toLowerCase().includes(key),
    );
  }, [products, keyword]);

  return (
    <main className="bg-[#fbfaf7]">
      <section className="bg-[#0B2D4D] px-4 py-12 text-white sm:px-8 sm:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-white/80">{subtitle}</p>
      </section>

      <section className="px-4 py-10 sm:px-8 sm:py-12">
        {loading ? <p>Đang tải sản phẩm...</p> : null}
        {!loading && filtered.length === 0 ? <p>Chưa có sản phẩm phù hợp.</p> : null}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <CatalogProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
