import RichTextContent from '@/components/common/RichTextContent';
import { Category } from './types';

type CategoryCardProps = {
  category: Category;
  childCount: number;
  depth?: number;
  isActive?: boolean;
  onOpenChildren?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CategoryCard({
  category,
  childCount,
  depth = 0,
  isActive,
  onOpenChildren,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        isActive ? 'border-[#0B2D4D] bg-[#f3f8ff]' : 'border-[#eee2d2] bg-[#fbfaf7]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-[#0B2D4D]">{category.name}</h4>
          <p className="mt-1 text-xs text-[#6b7280]">/{category.slug}</p>
          {depth > 0 ? <p className="mt-1 text-xs font-semibold text-[#7b5c26]">Danh mục con</p> : null}
        </div>
        <span className="rounded-full border border-[#d8cdb9] bg-white px-2 py-0.5 text-xs font-semibold text-[#334155]">
          {childCount} con
        </span>
      </div>
      <RichTextContent
        value={category.description}
        fallback="Chưa có mô tả"
        className="mt-2 line-clamp-2 break-words text-sm leading-6 text-[#4b5563]"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {onOpenChildren ? (
          <button
            onClick={onOpenChildren}
            className="rounded-lg border border-[#c8b18a] px-3 py-1.5 text-xs font-semibold text-[#7b5c26]"
          >
            Mở nhánh
          </button>
        ) : null}
        <button onClick={onEdit} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">
          Sửa
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
        >
          Xóa
        </button>
      </div>
    </article>
  );
}
