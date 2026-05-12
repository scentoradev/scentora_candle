import { Category } from './types';

type CategoryCardProps = {
  category: Category;
  onOpenChildren?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CategoryCard({ category, onOpenChildren, onEdit, onDelete }: CategoryCardProps) {
  return (
    <article className="rounded-[24px] border border-[#eee2d2] bg-[#fbfaf7] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[#b8933b]">Danh mục</p>
      <h4 className="mt-2 text-xl font-semibold text-[#0B2D4D]">{category.name}</h4>
      <p className="mt-1 text-sm text-[#6b7280]">/{category.slug}</p>
      <p className="mt-3 text-sm text-[#4b5563]">{category.description || 'Chưa có mô tả'}</p>
      <div className="mt-4 flex gap-2">
        {onOpenChildren ? (
          <button onClick={onOpenChildren} className="rounded-full border border-[#c8b18a] px-3 py-1 text-sm text-[#7b5c26]">
            Xem danh mục con
          </button>
        ) : null}
        <button onClick={onEdit} className="rounded-full border px-3 py-1 text-sm">Sửa</button>
        <button onClick={onDelete} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">Xóa</button>
      </div>
    </article>
  );
}
