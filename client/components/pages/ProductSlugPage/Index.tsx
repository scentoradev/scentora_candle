'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useMemo } from 'react';
import RichTextContent from '@/components/common/RichTextContent';
import { useProducts } from '@/hooks/useProducts';

type ProductSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const defaultImage = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200';

export default function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { slug } = use(params);
  const { products, loading } = useProducts();

  const product = useMemo(() => products.find((item) => item.slug === slug) ?? null, [products, slug]);

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
        <div className="relative h-[420px] overflow-hidden rounded-[20px]">
          <Image src={product.thumbnail_url || defaultImage} alt={product.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#0B2D4D]">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-[#0B2D4D]">{Number(product.price).toLocaleString('vi-VN')}đ</p>
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
    </main>
  );
}
