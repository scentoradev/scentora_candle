'use client';

import { useMemo } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { useProducts } from '../../../hooks/useProducts';
import MainProductCard from './MainProductCard';

export default function MainPage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const displayProducts = useMemo(() => {
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 4).map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: `${Number(item.price || 0).toLocaleString('vi-VN')}đ`,
      tag: 'Showroom',
      image:
        item.thumbnail_url ||
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200',
    }));
  }, [products]);

  const displayCategories = categories.slice(0, 3).map((category) => category.name);

  return (
    <main className="bg-[#fbfaf7]">
      <section className="grid min-h-[680px] grid-cols-1 md:grid-cols-2">
        <div className="flex items-center bg-[#0B2D4D] px-10 py-20 text-white md:px-20">
          <div className="max-w-xl">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Scentora Candle</p>
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">Thắp sáng không gian sống</h1>
            <p className="mb-9 text-lg leading-8 text-gray-200">Bộ sưu tập nến thơm cao cấp cho không gian sống thư giãn, ấm áp và sang trọng.</p>
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

      <section className="border-b border-[#eadfce] bg-[#f4efe7] px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.25em] text-[#0B2D4D]">Hương thơm cao cấp cho không gian sống</p>
          <div className="flex gap-3 text-sm">
            {displayCategories.map((categoryName) => (
              <button key={categoryName} className="rounded-full border border-[#0B2D4D]/20 px-5 py-2">{categoryName}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-8 py-20 md:px-14">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">Bộ sưu tập đặc trưng</p>
            <h2 className="text-4xl font-bold text-[#0B2D4D] md:text-5xl">Nến thơm nổi bật</h2>
          </div>
        </div>

        {loading ? <p>Đang tải sản phẩm...</p> : null}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {displayProducts.map((product) => (
            <MainProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}
