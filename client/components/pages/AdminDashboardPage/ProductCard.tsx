import Image from 'next/image';
import RichTextContent from '@/components/common/RichTextContent';
import { Product } from './types';

type ProductCardProps = {
  product: Product;
  categoryName: string;
  defaultImage: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({ product, categoryName, defaultImage, onEdit, onDelete }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#eee2d2] bg-white shadow-sm">
      <div className="relative h-[280px] overflow-hidden">
        <Image
          src={product.thumbnail_url || defaultImage}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#0B2D4D] px-3 py-1 text-xs text-white">{categoryName}</span>
      </div>
      <div className="space-y-2 p-4">
        <h4 className="text-lg font-semibold text-[#1f1f1f]">{product.name}</h4>
        <p className="line-clamp-2 text-sm text-[#6b7280]">{product.short_description || 'Chưa có mô tả ngắn'}</p>
        <RichTextContent
          value={product.description}
          className="max-h-36 overflow-auto break-words text-sm leading-7 text-[#4b5563]"
        />
        <p className="text-xl font-bold text-[#0B2D4D]">{Number(product.price).toLocaleString('vi-VN')}đ</p>
        <p className="text-sm text-[#6b7280]">Tồn kho: {product.stock}</p>
        <div className="flex gap-2 pt-1">
          <button onClick={onEdit} className="rounded-full border px-3 py-1 text-sm">Sửa</button>
          <button onClick={onDelete} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">Xóa</button>
        </div>
      </div>
    </article>
  );
}
