import RichTextEditor from '@/components/common/RichTextEditor';
import { Category } from './types';

type CategoryChildrenPanelProps = {
  parentCategory: Category | null;
  childrenCategories: Category[];
  newChild: { name: string; slug: string; description: string; sortOrder: string; isHomeVisible: boolean };
  editingChildId: string;
  editingChild: { name: string; slug: string; description: string; sortOrder: string; isHomeVisible: boolean };
  onBackToParent: (parentId: string) => void;
  onOpenChildren: (categoryId: string) => void;
  onNewChildChange: (
    field: 'name' | 'slug' | 'description' | 'sortOrder' | 'isHomeVisible',
    value: string,
  ) => void;
  onCreateChild: () => void;
  onStartEditChild: (child: Category) => void;
  onEditingChildChange: (
    field: 'name' | 'slug' | 'description' | 'sortOrder' | 'isHomeVisible',
    value: string,
  ) => void;
  onSaveEditChild: () => void;
  onDeleteChild: (child: Category) => void;
};

export default function CategoryChildrenPanel({
  parentCategory,
  childrenCategories,
  newChild,
  editingChildId,
  editingChild,
  onBackToParent,
  onOpenChildren,
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-[#0B2D4D]">Nhánh con của: {parentCategory.name}</h3>
        {parentCategory.parent_id ? (
          <button
            onClick={() => onBackToParent(parentCategory.parent_id as string)}
            className="rounded-lg border border-[#d8cdb9] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#f8f4ec]"
          >
            Lên cấp cha
          </button>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-[#e9dfcf] bg-[#fbfaf7] p-4">
        <h4 className="text-sm font-bold uppercase tracking-wide text-[#0B2D4D]">Thêm danh mục con</h4>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <input
            value={newChild.name}
            onChange={(e) => onNewChildChange('name', e.target.value)}
            placeholder="Tên danh mục con"
            className="rounded-xl border px-3 py-2"
          />
          <input
            value={newChild.slug}
            onChange={(e) => onNewChildChange('slug', e.target.value)}
            placeholder="Slug"
            className="rounded-xl border px-3 py-2"
          />
          <input
            type="number"
            value={newChild.sortOrder}
            onChange={(e) => onNewChildChange('sortOrder', e.target.value)}
            placeholder="Thứ tự hiển thị"
            className="rounded-xl border px-3 py-2"
          />
          <button onClick={onCreateChild} className="rounded-xl bg-[#0B2D4D] px-3 py-2 text-sm font-semibold text-white">
            Thêm vào nhánh
          </button>
        </div>
        <label className="mt-2 flex items-center justify-between rounded-xl border px-3 py-2">
          <span className="text-sm font-semibold text-[#334155]">Hiển thị ở Home Page</span>
          <button
            type="button"
            onClick={() => onNewChildChange('isHomeVisible', String(!newChild.isHomeVisible))}
            className={`relative h-7 w-14 rounded-full transition ${newChild.isHomeVisible ? 'bg-[#0B2D4D]' : 'bg-[#cbd5e1]'}`}
            aria-pressed={newChild.isHomeVisible}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${newChild.isHomeVisible ? 'left-7' : 'left-1'}`} />
          </button>
        </label>
        <div className="mt-3">
          <RichTextEditor
            value={newChild.description}
            onChange={(value) => onNewChildChange('description', value)}
            placeholder="Mô tả ngắn danh mục con"
            minHeight={110}
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e9dfcf]">
        <div className="grid grid-cols-12 bg-[#f8f4ec] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#475569]">
          <p className="col-span-4">Tên</p>
          <p className="col-span-3">Slug</p>
          <p className="col-span-2">Thứ tự</p>
          <p className="col-span-3 text-right">Thao tác</p>
        </div>
        {childrenCategories.length === 0 ? (
          <p className="px-3 py-4 text-sm text-[#6b7280]">Danh mục này chưa có danh mục con.</p>
        ) : (
          childrenCategories.map((child) => (
            <div key={child.id} className="grid grid-cols-12 items-center border-t border-[#f2eadc] px-3 py-3 text-sm">
              <p className="col-span-4 truncate font-semibold text-[#0B2D4D]">{child.name}</p>
              <p className="col-span-3 truncate text-[#6b7280]">/{child.slug}</p>
              <p className="col-span-2 text-[#6b7280]">{child.sort_order ?? 0}</p>
              <div className="col-span-3 flex justify-end gap-2">
                <button onClick={() => onOpenChildren(child.id)} className="rounded-lg border border-[#c8b18a] px-2.5 py-1 text-xs font-semibold text-[#7b5c26]">
                  Mở
                </button>
                <button onClick={() => onStartEditChild(child)} className="rounded-lg border px-2.5 py-1 text-xs font-semibold">
                  Sửa
                </button>
                <button onClick={() => onDeleteChild(child)} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600">
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingChildId ? (
        <div className="mt-4 rounded-2xl border border-[#e9dfcf] bg-white p-4">
          <h4 className="text-sm font-bold uppercase tracking-wide text-[#0B2D4D]">Sửa danh mục con</h4>
          <div className="mt-3 grid gap-2 md:grid-cols-4">
            <input value={editingChild.name} onChange={(e) => onEditingChildChange('name', e.target.value)} className="rounded-xl border px-3 py-2" />
            <input value={editingChild.slug} onChange={(e) => onEditingChildChange('slug', e.target.value)} className="rounded-xl border px-3 py-2" />
            <input type="number" value={editingChild.sortOrder} onChange={(e) => onEditingChildChange('sortOrder', e.target.value)} className="rounded-xl border px-3 py-2" placeholder="Thứ tự hiển thị" />
            <button onClick={onSaveEditChild} className="rounded-xl bg-[#0B2D4D] px-3 py-2 text-sm font-semibold text-white">
              Lưu sửa
            </button>
          </div>
          <label className="mt-2 flex items-center justify-between rounded-xl border px-3 py-2">
            <span className="text-sm font-semibold text-[#334155]">Hiển thị ở Home Page</span>
            <button
              type="button"
              onClick={() => onEditingChildChange('isHomeVisible', String(!editingChild.isHomeVisible))}
              className={`relative h-7 w-14 rounded-full transition ${editingChild.isHomeVisible ? 'bg-[#0B2D4D]' : 'bg-[#cbd5e1]'}`}
              aria-pressed={editingChild.isHomeVisible}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${editingChild.isHomeVisible ? 'left-7' : 'left-1'}`} />
            </button>
          </label>
          <div className="mt-3">
            <RichTextEditor
              value={editingChild.description}
              onChange={(value) => onEditingChildChange('description', value)}
              placeholder="Mô tả ngắn danh mục con"
              minHeight={110}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
