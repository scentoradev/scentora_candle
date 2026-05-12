import Image from 'next/image';
import Link from 'next/link';
import RichTextContent from '@/components/common/RichTextContent';
import { ProductItem } from '@/hooks/useProducts';

type CategoryProductCardProps = {
  product: ProductItem;
};

const defaultImage = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200';

export default function CategoryProductCard({ product }: CategoryProductCardProps) {
  return (
    <Link href={`/san_pham/${product.slug}`} className="block overflow-hidden rounded-[24px] border border-[#eee2d2] bg-white">
      <div className="relative h-[320px] w-full">
        <Image src={product.thumbnail_url || defaultImage} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#0B2D4D]">{product.name}</h2>
        <RichTextContent
          value={product.short_description || product.description}
          fallback="Sản phẩm showroom"
          className="mt-2 break-words text-sm leading-7 text-neutral-600"
        />
        <p className="mt-4 text-2xl font-bold text-[#0B2D4D]">{Number(product.price).toLocaleString('vi-VN')}đ</p>
        <button
          type="button"
          className="mt-5 inline-block rounded-full bg-[#0B2D4D] px-5 py-2 text-white"
          onClick={(event) => {
            event.preventDefault();
            window.open('https://zalo.me/0938962062', '_blank', 'noopener,noreferrer');
          }}
        >
          Liên hệ shop
        </button>
      </div>
    </Link>
  );
}
