import { Category } from './types';

type CategoryChildrenPanelProps = {
  parentCategory: Category | null;
  childrenCategories: Category[];
  newChild: { name: string; slug: string; description: string };
  editingChildId: string;
  editingChild: { name: string; slug: string; description: string };
  onNewChildChange: (field: 'name' | 'slug' | 'description', value: string) => void;
  onCreateChild: () => void;
  onStartEditChild: (child: Category) => void;
  onEditingChildChange: (field: 'name' | 'slug' | 'description', value: string) => void;
  onSaveEditChild: () => void;
  onDeleteChild: (child: Category) => void;
};

export default function CategoryChildrenPanel({
  parentCategory,
  childrenCategories,
  newChild,
  editingChildId,
  editingChild,
  onNewChildChange,
  onCreateChild,
  onStartEditChild,
  onEditingChildChange,
  onSaveEditChild,
  onDeleteChild,
}: CategoryChildrenPanelProps) {
  if (!parentCategory) return null;

  return (
    <section className="rounded-3xl border border-[#d8cdb9] bg-white p-6">
      <h3 className="text-2xl font-bold text-[#0B2D4D]">Chi tiết danh mục con</h3>
      <p className="mt-2 text-sm text-[#6b7280]">
        Danh mục cha: <span className="font-semibold text-[#0B2D4D]">{parentCategory.name}</span>
      </p>

      <div className="mt-4 rounded-2xl border border-[#e9dfcf] bg-[#fbfaf7] p-4">
        <h4 className="text-lg font-semibold text-[#0B2D4D]">Thêm danh mục con</h4>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <input value={newChild.name} onChange={(e) => onNewChildChange('name', e.target.value)} placeholder="Tên danh mục con" className="rounded-xl border px-3 py-2" />
          <input value={newChild.slug} onChange={(e) => onNewChildChange('slug', e.target.value)} placeholder="Slug" className="rounded-xl border px-3 py-2" />
          <input value={newChild.description} onChange={(e) => onNewChildChange('description', e.target.value)} placeholder="Mô tả ngắn" className="rounded-xl border px-3 py-2" />
          <button onClick={onCreateChild} className="rounded-xl bg-[#0B2D4D] px-3 py-2 text-sm font-semibold text-white">Lưu danh mục con</button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {childrenCategories.length === 0 ? (
          <p className="text-sm text-[#6b7280]">Danh mục cha này chưa có danh mục con.</p>
        ) : (
          childrenCategories.map((child) => (
            <article key={child.id} className="rounded-2xl border border-[#eee2d2] bg-[#fbfaf7] p-4">
              <h4 className="text-lg font-semibold text-[#0B2D4D]">{child.name}</h4>
              <p className="mt-1 text-sm text-[#6b7280]">/{child.slug}</p>
              <p className="mt-2 text-sm text-[#4b5563]">{child.description || 'Chưa có mô tả'}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => onStartEditChild(child)} className="rounded-full border px-3 py-1 text-sm">Sửa</button>
                <button onClick={() => onDeleteChild(child)} className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600">Xóa</button>
              </div>
            </article>
          ))
        )}
      </div>

      {editingChildId ? (
        <div className="mt-4 rounded-2xl border border-[#e9dfcf] bg-white p-4">
          <h4 className="text-lg font-semibold text-[#0B2D4D]">Sửa danh mục con</h4>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <input value={editingChild.name} onChange={(e) => onEditingChildChange('name', e.target.value)} className="rounded-xl border px-3 py-2" />
            <input value={editingChild.slug} onChange={(e) => onEditingChildChange('slug', e.target.value)} className="rounded-xl border px-3 py-2" />
            <input value={editingChild.description} onChange={(e) => onEditingChildChange('description', e.target.value)} className="rounded-xl border px-3 py-2" />
            <button onClick={onSaveEditChild} className="rounded-xl bg-[#0B2D4D] px-3 py-2 text-sm font-semibold text-white">Lưu sửa</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
