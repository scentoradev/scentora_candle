import { useMemo, useState } from 'react';
import RichTextContent from '@/components/common/RichTextContent';
import { formatVnd } from '@/utils/format';
import { getImageCandidates } from '@/utils/image';
import { Product } from './types';

type ProductCardProps = {
  product: Product;
  categoryName: string;
  defaultImage: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({ product, categoryName, defaultImage, onEdit, onDelete }: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const candidates = useMemo(
    () => getImageCandidates(product.thumbnail_url || defaultImage),
    [product.thumbnail_url, defaultImage],
  );
  const imageUrl = candidates[imageIndex] || defaultImage;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#eee2d2] bg-white shadow-sm">
      <div className="relative h-[280px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            setImageIndex((prev) => {
              if (prev + 1 < candidates.length) return prev + 1;
              return prev;
            });
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#0B2D4D] px-3 py-1 text-xs text-white">{categoryName}</span>
      </div>
      <div className="space-y-2 p-4">
        <h4 className="text-lg font-semibold text-[#1f1f1f]">{product.name}</h4>
        <RichTextContent
          value={product.short_description}
          fallback="Chưa có mô tả ngắn"
          className="line-clamp-2 text-sm text-[#6b7280]"
        />
        <RichTextContent
          value={product.description}
          className="max-h-36 overflow-auto break-words text-sm leading-7 text-[#4b5563]"
        />
        <p className="text-xl font-bold text-[#0B2D4D]">{formatVnd(product.price)}</p>
        <p className="text-sm text-[#6b7280]">Tồn kho: {product.stock}</p>
        <div className="flex gap-2 pt-1">
          <button onClick={onEdit} className="rounded-full border px-3 py-1 text-sm">Sửa</button>
          <button onClick={onDelete} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">Xóa</button>
        </div>
      </div>
    </article>
  );
}
