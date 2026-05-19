'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';
import { formatVnd } from '@/utils/format';
import { useCategories } from '../../../hooks/useCategories';
import { useContentPages } from '../../../hooks/useContentPages';
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
  const { items: heroItems } = useContentPages({ type: 'hero', onlyPublished: true });
  const [activeHeroImageIndex, setActiveHeroImageIndex] = useState(0);

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const categorySections = useMemo(() => {
    const productsByCategory = new Map<string, typeof products>();
    products.forEach((product) => {
      if (!product.category_id) return;
      const bucket = productsByCategory.get(product.category_id) ?? [];
      bucket.push(product);
      productsByCategory.set(product.category_id, bucket);
    });

    const categoryList = categories.filter((category) => category.is_home_visible !== false);

    return categoryList.map((category) => {
      const randomProducts = shuffleArray(productsByCategory.get(category.id) ?? []).slice(0, 4);
      return {
        categoryId: category.id,
        categoryName: category.name || categoryNameById.get(category.id) || 'Danh mục khác',
        categorySlug: category.slug || '',
        products: randomProducts.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          shortDescription: item.short_description || item.description || '',
          price: formatVnd(item.price),
          tag: category.slug.toLowerCase().includes('nen') ? 'Nến thơm' : 'Gợi ý',
          image: item.thumbnail_url || DEFAULT_PRODUCT_IMAGE,
        })),
      };
    });
  }, [categories, products, categoryNameById]);

  const heroSlides = useMemo(() => {
    const parseExtra = (value?: string | null) =>
      (value ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [imageUrl = '', targetUrl = ''] = line.split('|').map((part) => part.trim());
          return { imageUrl, targetUrl };
        })
        .filter((item) => Boolean(item.imageUrl));

    const slides = heroItems.flatMap((item) => {
      const primary = item.thumbnail_url
        ? [{ imageUrl: item.thumbnail_url, targetUrl: (item.summary || '').trim() }]
        : [];
      return [...primary, ...parseExtra(item.content)];
    });

    return slides.length
      ? slides
      : [{ imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1400', targetUrl: '' }];
  }, [heroItems]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveHeroImageIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroSlides]);

  return (
    <main className="bg-[#fbfaf7]">
      <section className="grid min-h-140 grid-cols-1 md:min-h-170 md:grid-cols-2">
        <div className="flex items-center bg-[#0B2D4D] px-5 py-14 text-white sm:px-8 md:px-12 lg:px-20">
          <div className="max-w-xl">
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#D4AF37]">Scentora Candle</p>
            <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-7xl">Thắp sáng không gian sống</h1>
            <p className="mb-9 text-base leading-7 text-gray-200 sm:text-lg sm:leading-8">Bộ sưu tập nến thơm cao cấp cho không gian sống thư giãn, ấm áp và sang trọng.</p>
          </div>
        </div>

        <div className="relative min-h-105 overflow-hidden md:min-h-130">
          {heroSlides.map((slide, index) => (
            <a
              key={`${slide.imageUrl}-${index}`}
              href={slide.targetUrl || undefined}
              target={slide.targetUrl.startsWith('http') ? '_blank' : undefined}
              rel={slide.targetUrl.startsWith('http') ? 'noreferrer' : undefined}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
                index === activeHeroImageIndex ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
              style={{
                backgroundImage:
                  `linear-gradient(rgba(11,45,77,0.14), rgba(11,45,77,0.14)), url('${slide.imageUrl}')`,
              }}
            />
          ))}
          {heroSlides.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveHeroImageIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
                }
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 text-white transition hover:bg-black/50"
                aria-label="Slide trước"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveHeroImageIndex((prev) => (prev + 1) % heroSlides.length)
                }
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 text-white transition hover:bg-black/50"
                aria-label="Slide tiếp theo"
              >
                ›
              </button>
            </>
          ) : null}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveHeroImageIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeHeroImageIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/60'
                }`}
                aria-label={`Chuyển ảnh ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {categorySections.map((section) => (
        <section key={section.categoryId} className="w-full px-4 py-10 sm:px-8 md:px-10 lg:px-14">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0B2D4D] md:text-5xl">{section.categoryName}</h2>
            </div>
            {section.categorySlug ? (
              <a
                href={`/${section.categorySlug}`}
                className="inline-flex items-center rounded-full border border-[#0B2D4D] px-5 py-2 text-sm font-semibold text-[#0B2D4D] transition hover:bg-[#0B2D4D] hover:text-white"
              >
                Xem thêm
              </a>
            ) : null}
          </div>
          <div className="rounded-[28px] border border-[#eadfce] bg-white/60 p-6 sm:p-8">
            {section.products.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                {section.products.map((product) => (
                  <MainProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`${section.categoryId}-empty-${index}`}
                    className="overflow-hidden rounded-[28px] border border-[#e8decd] bg-white"
                  >
                    <div className="flex h-[260px] items-center justify-center bg-gradient-to-br from-[#f6efe3] via-[#f9f5ee] to-[#efe4d3] px-6 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[#0B2D4D]/55 sm:h-[300px] md:h-[320px]">
                      Chưa có sản phẩm
                    </div>
                    <div className="p-6">
                      <p className="text-base text-[#0B2D4D]/70">Danh mục này hiện chưa có sản phẩm.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}


