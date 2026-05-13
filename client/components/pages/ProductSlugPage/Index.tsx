'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import RichTextContent from '@/components/common/RichTextContent';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';
import { useProductImages } from '@/hooks/useProductImages';
import { useProducts } from '@/hooks/useProducts';
import { formatVnd } from '@/utils/format';

type ProductSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { slug } = use(params);
  const { products, loading } = useProducts();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cardImageTick, setCardImageTick] = useState(0);

  const product = useMemo(() => products.find((item) => item.slug === slug) ?? null, [products, slug]);
  const { images } = useProductImages(product?.id);
  const { images: allProductImages } = useProductImages();
  const galleryImages = useMemo(
    () =>
      [...images]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.image_url)
        .filter(Boolean),
    [images],
  );
  const productSlides = useMemo(() => {
    const unique = new Set<string>();
    const ordered = [product?.thumbnail_url || DEFAULT_PRODUCT_IMAGE, ...galleryImages].filter((url) => {
      if (!url || unique.has(url)) return false;
      unique.add(url);
      return true;
    });
    return ordered.length ? ordered : [DEFAULT_PRODUCT_IMAGE];
  }, [galleryImages, product?.thumbnail_url]);

  useEffect(() => {
    if (productSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % productSlides.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [productSlides]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCardImageTick((prev) => prev + 1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const productImageMap = useMemo(() => {
    const map = new Map<string, string[]>();
    allProductImages.forEach((item) => {
      const list = map.get(item.product_id) ?? [];
      list.push(item.image_url);
      map.set(item.product_id, list);
    });
    return map;
  }, [allProductImages]);

  const otherProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(
      (item) => item.id !== product.id && item.category_id && item.category_id === product.category_id,
    );
    const differentCategory = products.filter(
      (item) => item.id !== product.id && (!product.category_id || item.category_id !== product.category_id),
    );
    return [...sameCategory, ...differentCategory].slice(0, 8);
  }, [product, products]);

  const otherProductSlidesMap = useMemo(() => {
    const map = new Map<string, string[]>();
    otherProducts.forEach((item) => {
      const unique = new Set<string>();
      const slides = [item.thumbnail_url || DEFAULT_PRODUCT_IMAGE, ...(productImageMap.get(item.id) ?? [])].filter((url) => {
        if (!url || unique.has(url)) return false;
        unique.add(url);
        return true;
      });
      map.set(item.id, slides.length ? slides : [DEFAULT_PRODUCT_IMAGE]);
    });
    return map;
  }, [otherProducts, productImageMap]);

  if (loading) {
    return <main className="bg-[#fbfaf7] px-8 py-12">Đang tải sản phẩm...</main>;
  }

  if (!product) {
    return (
      <main className="bg-[#fbfaf7] px-8 py-16">
        <h1 className="text-4xl font-bold text-[#0B2D4D]">404</h1>
        <p className="mt-4 text-[#4b5563]">Không tìm thấy sản phẩm phù hợp.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-[#0B2D4D] px-6 py-3 text-white">
          Quay về trang chủ
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#fbfaf7] px-8 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[24px] border border-[#eee2d2] bg-white p-8 md:grid-cols-2">
        <div>
          <div className="relative h-[420px] overflow-hidden rounded-[20px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={productSlides[activeImageIndex % productSlides.length] || DEFAULT_PRODUCT_IMAGE}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
            />
            {productSlides.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + productSlides.length) % productSlides.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 px-3 py-2 text-white hover:bg-black/50"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % productSlides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 px-3 py-2 text-white hover:bg-black/50"
                >
                  ›
                </button>
              </>
            ) : null}
          </div>
          {productSlides.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {productSlides.map((imageUrl, index) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-28 overflow-hidden rounded-xl border ${index === activeImageIndex ? 'border-[#0B2D4D]' : 'border-[#eee2d2]'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#0B2D4D]">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-[#0B2D4D]">{formatVnd(product.price)}</p>
          <RichTextContent
            value={product.description || product.short_description}
            fallback="Sản phẩm showroom."
            className="mt-6 break-words leading-8 text-[#4b5563]"
          />
          <p className="mt-4 text-sm text-[#6b7280]">
            Tình trạng: {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'} ({product.stock})
          </p>
          <a href="https://zalo.me/0938962062" target="_blank" className="mt-8 inline-block rounded-full bg-[#0B2D4D] px-6 py-3 text-white" rel="noreferrer">
            Liên hệ shop
          </a>
        </div>
      </div>

      {otherProducts.length ? (
        <section className="mx-auto mt-12 max-w-6xl">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-[#0B2D4D]">Sản phẩm khác</h2>
            <Link href="/" className="text-sm font-semibold text-[#0B2D4D] hover:underline">
              Xem thêm
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {otherProducts.map((item) => {
              const slides = otherProductSlidesMap.get(item.id) ?? [item.thumbnail_url || DEFAULT_PRODUCT_IMAGE];
              const imageToShow = slides[cardImageTick % slides.length];
              return (
                <Link
                  key={item.id}
                  href={`/san_pham/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#eee2d2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-52 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageToShow}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="line-clamp-2 min-h-12 text-base font-semibold text-[#1f1f1f]">{item.name}</h3>
                    <RichTextContent
                      value={item.short_description || item.description}
                      fallback="Sản phẩm thủ công cao cấp cho không gian sống."
                      className="line-clamp-2 min-h-10 text-sm text-[#6b7280]"
                    />
                    <p className="text-lg font-bold text-[#0B2D4D]">{formatVnd(item.price)}</p>
                    {(productImageMap.get(item.id) ?? []).length ? (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {(productImageMap.get(item.id) ?? []).slice(0, 3).map((imageUrl) => (
                          <div key={`${item.id}-${imageUrl}`} className="h-14 overflow-hidden rounded-md border border-[#eee2d2]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
