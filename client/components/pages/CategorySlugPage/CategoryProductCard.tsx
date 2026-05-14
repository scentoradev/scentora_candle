import Link from 'next/link';
import RichTextContent from '@/components/common/RichTextContent';
import { ProductItem } from '@/hooks/useProducts';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';
import { formatVnd } from '@/utils/format';

type CategoryProductCardProps = {
  product: ProductItem;
};



export default function CategoryProductCard({ product }: CategoryProductCardProps) {
  return (
    <Link href={`/san_pham/${product.slug}`} className="block overflow-hidden rounded-[24px] border border-[#eee2d2] bg-white">
      <div className="relative h-[240px] w-full sm:h-[280px] md:h-[320px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail_url || DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-[#0B2D4D]">{product.name}</h2>
        <RichTextContent
          value={product.short_description || product.description}
          fallback="Sản phẩm showroom"
          className="mt-2 break-words text-sm leading-7 text-neutral-600"
        />
        <p className="mt-4 text-2xl font-bold text-[#0B2D4D]">{formatVnd(product.price)}</p>
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

