import type { FormEvent } from 'react';
import { apiDelete, apiPatch, apiPost } from '@/hooks/api';
import RichTextEditor from '@/components/common/RichTextEditor';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import CategoryChildrenPanel from './CategoryChildrenPanel';
import type { Category, Product } from './types';

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

type Props = {
  busy: boolean;
  categories: Category[];
  filteredCategories: Category[];
  childCategoriesMap: Map<string, Category[]>;
  selectedParentCategoryId: string;
  setSelectedParentCategoryId: React.Dispatch<React.SetStateAction<string>>;
  selectedParentCategory: Category | null;
  selectedParentChildren: Category[];
  newChildCategory: { name: string; slug: string; description: string };
  setNewChildCategory: React.Dispatch<React.SetStateAction<{ name: string; slug: string; description: string }>>;
  editingChildCategoryId: string;
  setEditingChildCategoryId: React.Dispatch<React.SetStateAction<string>>;
  editingChildCategory: { name: string; slug: string; description: string };
  setEditingChildCategory: React.Dispatch<React.SetStateAction<{ name: string; slug: string; description: string }>>;
  newCategory: { name: string; slug: string; description: string; parentId: string };
  setNewCategory: React.Dispatch<React.SetStateAction<{ name: string; slug: string; description: string; parentId: string }>>;
  editingCategoryId: string;
  setEditingCategoryId: React.Dispatch<React.SetStateAction<string>>;
  editingCategory: { name: string; slug: string; description: string; parentId: string };
  setEditingCategory: React.Dispatch<React.SetStateAction<{ name: string; slug: string; description: string; parentId: string }>>;
  categorySearch: string;
  setCategorySearch: React.Dispatch<React.SetStateAction<string>>;
  submitCategory: (e: FormEvent) => Promise<void>;
  productImages: ProductImage[];
  filteredProducts: Product[];
  categoryMap: Map<string, string>;
  defaultProductImage: string;
  newProduct: { name: string; slug: string; price: string; stock: string; categoryId: string; shortDescription: string; description: string; thumbnailUrl: string; galleryUrls: string };
  setNewProduct: React.Dispatch<React.SetStateAction<{ name: string; slug: string; price: string; stock: string; categoryId: string; shortDescription: string; description: string; thumbnailUrl: string; galleryUrls: string }>>;
  submitProduct: (e: FormEvent) => Promise<void>;
  productSearch: string;
  setProductSearch: React.Dispatch<React.SetStateAction<string>>;
  productCategoryFilter: string;
  setProductCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  productStockFilter: 'all' | 'in_stock' | 'out_of_stock';
  setProductStockFilter: React.Dispatch<React.SetStateAction<'all' | 'in_stock' | 'out_of_stock'>>;
  editingProductId: string;
  setEditingProductId: React.Dispatch<React.SetStateAction<string>>;
  editingProduct: { name: string; price: string; stock: string; categoryId: string; shortDescription: string; description: string; thumbnailUrl: string; galleryUrls: string };
  setEditingProduct: React.Dispatch<React.SetStateAction<{ name: string; price: string; stock: string; categoryId: string; shortDescription: string; description: string; thumbnailUrl: string; galleryUrls: string }>>;
  parseGalleryUrls: (value: string) => string[];
  run: (action: () => Promise<void>, successMessage: string) => Promise<void>;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
};

export default function CatalogManagementSection(props: Props) {
  const {
    busy,
    categories,
    filteredCategories,
    childCategoriesMap,
    selectedParentCategoryId,
    setSelectedParentCategoryId,
    selectedParentCategory,
    selectedParentChildren,
    newChildCategory,
    setNewChildCategory,
    editingChildCategoryId,
    setEditingChildCategoryId,
    editingChildCategory,
    setEditingChildCategory,
    newCategory,
    setNewCategory,
    editingCategoryId,
    setEditingCategoryId,
    editingCategory,
    setEditingCategory,
    categorySearch,
    setCategorySearch,
    submitCategory,
    productImages,
    filteredProducts,
    categoryMap,
    defaultProductImage,
    newProduct,
    setNewProduct,
    submitProduct,
    productSearch,
    setProductSearch,
    productCategoryFilter,
    setProductCategoryFilter,
    productStockFilter,
    setProductStockFilter,
    editingProductId,
    setEditingProductId,
    editingProduct,
    setEditingProduct,
    parseGalleryUrls,
    run,
    askConfirm,
    closeConfirm,
  } = props;

  return (
    <>
      <section className="rounded-3xl border border-[#d8cdb9] bg-white p-6">
        <h3 className="mb-5 text-2xl font-bold text-[#0B2D4D]">Danh mục</h3>
        <form onSubmit={(e) => void submitCategory(e)} className="mb-5 space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4">
          <h4 className="text-lg font-bold text-[#0B2D4D]">Thêm danh mục</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={newCategory.name} onChange={(e) => setNewCategory((v) => ({ ...v, name: e.target.value }))} placeholder="Tên danh mục" className="rounded-xl border px-3 py-2" required />
            <input value={newCategory.slug} onChange={(e) => setNewCategory((v) => ({ ...v, slug: e.target.value }))} placeholder="Slug (ví dụ: nen_thom_phong)" className="rounded-xl border px-3 py-2" required />
          </div>
          <RichTextEditor value={newCategory.description} onChange={(value) => setNewCategory((v) => ({ ...v, description: value }))} placeholder="Mô tả ngắn danh mục" minHeight={120} />
          <select value={newCategory.parentId} onChange={(e) => setNewCategory((v) => ({ ...v, parentId: e.target.value }))} className="w-full rounded-xl border px-3 py-2">
            <option value="">Không có danh mục cha</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <button disabled={busy} className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu danh mục</button>
        </form>
        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <input value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} placeholder="Tìm danh mục theo tên, slug..." className="rounded-xl border px-3 py-2" />
          <button type="button" onClick={() => setCategorySearch('')} className="rounded-xl border border-[#d8cdb9] px-3 py-2 text-sm font-semibold text-[#334155] hover:bg-[#f8f4ec]">Xóa bộ lọc danh mục</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.filter((category) => !category.parent_id).map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onOpenChildren={childCategoriesMap.get(category.id)?.length ? () => setSelectedParentCategoryId(category.id) : undefined}
              onEdit={() => {
                setEditingCategoryId(category.id);
                setEditingCategory({ name: category.name, slug: category.slug, description: category.description || '', parentId: category.parent_id || '' });
              }}
              onDelete={() => askConfirm('Xác nhận xóa', `Bạn có chắc muốn xóa danh mục "${category.name}"?`, () => { closeConfirm(); void run(async () => { await apiDelete(`/categories/${category.id}`, true); }, 'Đã xóa danh mục'); })}
            />
          ))}
        </div>
        {editingCategoryId ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askConfirm('Xác nhận lưu', 'Bạn có chắc muốn lưu thay đổi danh mục này?', () => {
                closeConfirm();
                void run(async () => {
                  await apiPatch(`/categories/${editingCategoryId}`, { data: { name: editingCategory.name, slug: editingCategory.slug, description: editingCategory.description, parent_id: editingCategory.parentId || null } }, true);
                  setEditingCategoryId('');
                }, 'Đã cập nhật danh mục');
              });
            }}
            className="mt-5 space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <input value={editingCategory.name} onChange={(e) => setEditingCategory((v) => ({ ...v, name: e.target.value }))} className="rounded-xl border px-3 py-2" />
              <input value={editingCategory.slug} onChange={(e) => setEditingCategory((v) => ({ ...v, slug: e.target.value }))} className="rounded-xl border px-3 py-2" />
            </div>
            <RichTextEditor value={editingCategory.description} onChange={(value) => setEditingCategory((v) => ({ ...v, description: value }))} placeholder="Mô tả ngắn danh mục" minHeight={120} />
            <select value={editingCategory.parentId} onChange={(e) => setEditingCategory((v) => ({ ...v, parentId: e.target.value }))} className="rounded-xl border px-3 py-2">
              <option value="">Không có danh mục cha</option>
              {categories.filter((category) => category.id !== editingCategoryId).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button className="rounded-xl bg-[#0B2D4D] px-3 py-2 text-sm font-semibold text-white">Lưu sửa danh mục</button>
          </form>
        ) : null}
      </section>

      <CategoryChildrenPanel
        parentCategory={selectedParentCategory}
        childrenCategories={selectedParentChildren}
        newChild={newChildCategory}
        editingChildId={editingChildCategoryId}
        editingChild={editingChildCategory}
        onNewChildChange={(field, value) => setNewChildCategory((prev) => ({ ...prev, [field]: value }))}
        onCreateChild={() => {
          if (!selectedParentCategoryId) return;
          askConfirm('Xác nhận lưu', 'Bạn có chắc muốn thêm danh mục con này?', () => {
            closeConfirm();
            void run(async () => {
              await apiPost('/categories', { data: { name: newChildCategory.name, slug: newChildCategory.slug, description: newChildCategory.description, parent_id: selectedParentCategoryId } }, true);
              setNewChildCategory({ name: '', slug: '', description: '' });
            }, 'Đã thêm danh mục con');
          });
        }}
        onStartEditChild={(child) => {
          setEditingChildCategoryId(child.id);
          setEditingChildCategory({ name: child.name, slug: child.slug, description: child.description || '' });
        }}
        onEditingChildChange={(field, value) => setEditingChildCategory((prev) => ({ ...prev, [field]: value }))}
        onSaveEditChild={() => {
          if (!editingChildCategoryId) return;
          askConfirm('Xác nhận lưu', 'Bạn có chắc muốn lưu sửa danh mục con này?', () => {
            closeConfirm();
            void run(async () => {
              await apiPatch(`/categories/${editingChildCategoryId}`, { data: { name: editingChildCategory.name, slug: editingChildCategory.slug, description: editingChildCategory.description, parent_id: selectedParentCategoryId || null } }, true);
              setEditingChildCategoryId('');
              setEditingChildCategory({ name: '', slug: '', description: '' });
            }, 'Đã cập nhật danh mục con');
          });
        }}
        onDeleteChild={(child) => {
          askConfirm('Xác nhận xóa', `Bạn có chắc muốn xóa danh mục con "${child.name}"?`, () => {
            closeConfirm();
            void run(async () => {
              await apiDelete(`/categories/${child.id}`, true);
              if (editingChildCategoryId === child.id) {
                setEditingChildCategoryId('');
                setEditingChildCategory({ name: '', slug: '', description: '' });
              }
            }, 'Đã xóa danh mục con');
          });
        }}
      />

      <section className="rounded-3xl border border-[#d8cdb9] bg-white p-6">
        <h3 className="mb-5 text-2xl font-bold text-[#0B2D4D]">Sản phẩm</h3>
        <form onSubmit={(e) => void submitProduct(e)} className="mb-5 space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4">
          <h4 className="text-lg font-bold text-[#0B2D4D]">Thêm sản phẩm</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={newProduct.name} onChange={(e) => setNewProduct((v) => ({ ...v, name: e.target.value }))} placeholder="Tên sản phẩm" className="rounded-xl border px-3 py-2" required />
            <input value={newProduct.slug} onChange={(e) => setNewProduct((v) => ({ ...v, slug: e.target.value }))} placeholder="Slug sản phẩm" className="rounded-xl border px-3 py-2" required />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={newProduct.price} onChange={(e) => setNewProduct((v) => ({ ...v, price: e.target.value }))} placeholder="Giá tiền (VND)" className="rounded-xl border px-3 py-2" required />
            <input value={newProduct.stock} onChange={(e) => setNewProduct((v) => ({ ...v, stock: e.target.value }))} placeholder="Tồn kho" className="rounded-xl border px-3 py-2" required />
          </div>
          <select value={newProduct.categoryId} onChange={(e) => setNewProduct((v) => ({ ...v, categoryId: e.target.value }))} className="w-full rounded-xl border px-3 py-2">
            <option value="">Không gán danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <RichTextEditor value={newProduct.shortDescription} onChange={(value) => setNewProduct((v) => ({ ...v, shortDescription: value }))} placeholder="Mô tả ngắn cho thẻ sản phẩm" minHeight={120} />
          <RichTextEditor value={newProduct.description} onChange={(value) => setNewProduct((v) => ({ ...v, description: value }))} placeholder="Mô tả chi tiết sản phẩm" />
          <input value={newProduct.thumbnailUrl} onChange={(e) => setNewProduct((v) => ({ ...v, thumbnailUrl: e.target.value }))} placeholder="Link ảnh đại diện" className="w-full rounded-xl border px-3 py-2" />
          <textarea value={newProduct.galleryUrls} onChange={(e) => setNewProduct((v) => ({ ...v, galleryUrls: e.target.value }))} placeholder={'Ảnh phụ (mỗi dòng 1 URL)\nhttps://.../image-1.jpg\nhttps://.../image-2.jpg'} className="min-h-24 w-full rounded-xl border px-3 py-2" />
          <button disabled={busy} className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu sản phẩm</button>
        </form>
        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Tìm sản phẩm theo tên, slug..." className="rounded-xl border px-3 py-2" />
          <select value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)} className="rounded-xl border px-3 py-2">
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select value={productStockFilter} onChange={(e) => setProductStockFilter(e.target.value as 'all' | 'in_stock' | 'out_of_stock')} className="rounded-xl border px-3 py-2">
            <option value="all">Tất cả tồn kho</option>
            <option value="in_stock">Còn hàng</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
          <button type="button" onClick={() => { setProductSearch(''); setProductCategoryFilter('all'); setProductStockFilter('all'); }} className="rounded-xl border border-[#d8cdb9] px-3 py-2 text-sm font-semibold text-[#334155] hover:bg-[#f8f4ec]">Xóa bộ lọc sản phẩm</button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryMap.get(product.category_id || '') || 'Chưa phân loại'}
              defaultImage={defaultProductImage}
              onEdit={() => {
                setEditingProductId(product.id);
                setEditingProduct({
                  name: product.name,
                  price: String(product.price),
                  stock: String(product.stock),
                  categoryId: product.category_id || '',
                  shortDescription: product.short_description || '',
                  description: product.description || '',
                  thumbnailUrl: product.thumbnail_url || '',
                  galleryUrls: productImages.filter((item) => item.product_id === product.id).sort((a, b) => a.sort_order - b.sort_order).map((item) => item.image_url).join('\n'),
                });
              }}
              onDelete={() => askConfirm('Xác nhận xóa', `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`, () => { closeConfirm(); void run(async () => { await apiDelete(`/products/${product.id}`, true); }, 'Đã xóa sản phẩm'); })}
            />
          ))}
        </div>

        {editingProductId ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askConfirm('Xác nhận lưu', 'Bạn có chắc muốn lưu thay đổi sản phẩm này?', () => {
                closeConfirm();
                void run(async () => {
                  await apiPatch(
                    `/products/${editingProductId}`,
                    {
                      data: {
                        name: editingProduct.name,
                        price: Number(editingProduct.price || 0),
                        stock: Number(editingProduct.stock || 0),
                        category_id: editingProduct.categoryId || null,
                        short_description: editingProduct.shortDescription,
                        description: editingProduct.description,
                        thumbnail_url: editingProduct.thumbnailUrl,
                      },
                    },
                    true,
                  );
                  const existingImages = productImages
                    .filter((item) => item.product_id === editingProductId)
                    .sort((a, b) => a.sort_order - b.sort_order);
                  const nextUrls = parseGalleryUrls(editingProduct.galleryUrls);
                  const existingByUrl = new Map(existingImages.map((item) => [item.image_url, item]));

                  const deleteTasks = existingImages
                    .filter((item) => !nextUrls.includes(item.image_url))
                    .map((item) => apiDelete(`/product_images/${item.id}`, true));

                  const createTasks = nextUrls
                    .filter((url) => !existingByUrl.has(url))
                    .map((url, index) =>
                      apiPost(
                        '/product_images',
                        {
                          data: {
                            product_id: editingProductId,
                            image_url: url,
                            sort_order: index,
                          },
                        },
                        true,
                      ),
                    );

                  const updateSortTasks = nextUrls
                    .map((url, index) => {
                      const found = existingByUrl.get(url);
                      if (!found || found.sort_order === index) return null;
                      return apiPatch(`/product_images/${found.id}`, { data: { sort_order: index } }, true);
                    })
                    .filter(Boolean) as Promise<unknown>[];

                  await Promise.all([...deleteTasks, ...createTasks, ...updateSortTasks]);
                  setEditingProductId('');
                }, 'Đã cập nhật sản phẩm');
              });
            }}
            className="mt-6 rounded-2xl border border-[#d8cdb9] bg-[#fcfaf6] p-4 md:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Tên sản phẩm</label>
                    <input value={editingProduct.name} onChange={(e) => setEditingProduct((v) => ({ ...v, name: e.target.value }))} className="w-full rounded-xl border border-[#cfd8e3] bg-white px-3 py-2.5" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Giá tiền (VND)</label>
                    <input value={editingProduct.price} onChange={(e) => setEditingProduct((v) => ({ ...v, price: e.target.value }))} className="w-full rounded-xl border border-[#cfd8e3] bg-white px-3 py-2.5" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Số lượng</label>
                    <input value={editingProduct.stock} onChange={(e) => setEditingProduct((v) => ({ ...v, stock: e.target.value }))} className="w-full rounded-xl border border-[#cfd8e3] bg-white px-3 py-2.5" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Danh mục</label>
                    <select value={editingProduct.categoryId} onChange={(e) => setEditingProduct((v) => ({ ...v, categoryId: e.target.value }))} className="w-full rounded-xl border border-[#cfd8e3] bg-white px-3 py-2.5">
                      <option value="">Không gán danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Mô tả ngắn</label>
                    <RichTextEditor value={editingProduct.shortDescription} onChange={(value) => setEditingProduct((v) => ({ ...v, shortDescription: value }))} placeholder="Mô tả ngắn" minHeight={120} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Ảnh chính (URL)</label>
                  <input value={editingProduct.thumbnailUrl} onChange={(e) => setEditingProduct((v) => ({ ...v, thumbnailUrl: e.target.value }))} className="w-full rounded-xl border border-[#cfd8e3] bg-white px-3 py-2.5" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Mô tả chi tiết</label>
                  <div className="overflow-hidden rounded-xl border border-[#d8cdb9] bg-white">
                    <RichTextEditor value={editingProduct.description} onChange={(value) => setEditingProduct((v) => ({ ...v, description: value }))} placeholder="Mô tả chi tiết sản phẩm" />
                  </div>
                </div>
              </div>
              <div className="space-y-4 lg:col-span-4">
                <div className="rounded-xl border border-[#d8cdb9] bg-white p-3">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#64748b]">Ảnh phụ (mỗi dòng 1 URL)</label>
                  <textarea value={editingProduct.galleryUrls} onChange={(e) => setEditingProduct((v) => ({ ...v, galleryUrls: e.target.value }))} className="min-h-40 w-full rounded-xl border border-[#cfd8e3] px-3 py-2.5" />
                </div>
                <button className="w-full rounded-xl bg-[#0B2D4D] px-4 py-3 text-base font-semibold text-white hover:bg-[#12385c]">Lưu sửa sản phẩm</button>
              </div>
            </div>
          </form>
        ) : null}
      </section>
    </>
  );
}
