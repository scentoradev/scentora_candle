'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiDelete, apiGet, apiPatch, apiPost, type ApiListResponse } from '@/hooks/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDashboardCounts } from '@/hooks/useDashboardCounts';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RichTextEditor from '@/components/common/RichTextEditor';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import { AdminUser, Category, Product } from './types';
import CategoryChildrenPanel from './CategoryChildrenPanel';

const defaultImage = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200';

export default function AdminPage() {
  const router = useRouter();
  const { me, logout } = useAdminAuth();
  const {
    categoriesTotal,
    productsTotal,
    categoriesParentTotal,
    categoriesChildTotal,
  } = useDashboardCounts();

  const [sessionUser, setSessionUser] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: null | (() => void);
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', parentId: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: '0',
    stock: '0',
    categoryId: '',
    shortDescription: '',
    description: '',
    thumbnailUrl: '',
  });

  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [editingCategory, setEditingCategory] = useState({ name: '', slug: '', description: '', parentId: '' });

  const [editingProductId, setEditingProductId] = useState('');
  const [editingProduct, setEditingProduct] = useState({
    name: '',
    price: '0',
    stock: '0',
    categoryId: '',
    shortDescription: '',
    description: '',
    thumbnailUrl: '',
  });
  const [newChildCategory, setNewChildCategory] = useState({ name: '', slug: '', description: '' });
  const [editingChildCategoryId, setEditingChildCategoryId] = useState('');
  const [editingChildCategory, setEditingChildCategory] = useState({ name: '', slug: '', description: '' });
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const orderedCategories = useMemo(
    () =>
      [...categories].sort((a, b) => {
        const aIsChild = Boolean(a.parent_id);
        const bIsChild = Boolean(b.parent_id);
        if (aIsChild !== bIsChild) return aIsChild ? 1 : -1;
        return a.name.localeCompare(b.name, 'vi');
      }),
    [categories],
  );
  const selectedParentCategory = useMemo(
    () => categories.find((category) => category.id === selectedParentCategoryId) ?? null,
    [categories, selectedParentCategoryId],
  );
  const selectedParentChildren = useMemo(
    () => categories.filter((category) => category.parent_id === selectedParentCategoryId),
    [categories, selectedParentCategoryId],
  );
  const filteredCategories = useMemo(() => {
    const keyword = categorySearch.trim().toLowerCase();
    return orderedCategories.filter((category) => {
      return (
        keyword.length === 0 ||
        category.name.toLowerCase().includes(keyword) ||
        category.slug.toLowerCase().includes(keyword) ||
        (category.description || '').toLowerCase().includes(keyword)
      );
    });
  }, [orderedCategories, categorySearch]);
  const filteredProducts = useMemo(() => {
    const keyword = productSearch.trim().toLowerCase();
    return products.filter((product) => {
      const byKeyword =
        keyword.length === 0 ||
        product.name.toLowerCase().includes(keyword) ||
        product.slug.toLowerCase().includes(keyword) ||
        (product.short_description || '').toLowerCase().includes(keyword);
      const byCategory =
        productCategoryFilter === 'all' || product.category_id === productCategoryFilter;
      const byStock =
        productStockFilter === 'all' ||
        (productStockFilter === 'in_stock' && product.stock > 0) ||
        (productStockFilter === 'out_of_stock' && product.stock <= 0);
      return byKeyword && byCategory && byStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);
  const childCategoriesMap = useMemo(() => {
    const map = new Map<string, Category[]>();
    categories.forEach((category) => {
      if (!category.parent_id) return;
      const list = map.get(category.parent_id) ?? [];
      list.push(category);
      map.set(category.parent_id, list);
    });
    return map;
  }, [categories]);

  const loadAll = async () => {
    const [categoriesRes, productsRes] = await Promise.all([
      apiGet<ApiListResponse<Category>>('/categories'),
      apiGet<ApiListResponse<Product>>('/products'),
    ]);
    setCategories(categoriesRes.items ?? categoriesRes.data ?? []);
    setProducts(productsRes.items ?? productsRes.data ?? []);
  };

  const run = async (action: () => Promise<void>, successMessage: string) => {
    setBusy(true);
    setNotice('');
    try {
      await action();
      await loadAll();
      setNotice(successMessage);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setBusy(false);
    }
  };

  const askConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({ open: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmState({ open: false, title: '', message: '', onConfirm: null });
  };

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const user = (await me()) as AdminUser;
        if (!active) return;
        setSessionUser(user);
        await loadAll();
      } catch {
        if (active) router.push('/admin/login');
      }
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, [me, router]);

  const submitCategory = async (e: FormEvent) => {
    e.preventDefault();
    askConfirm('Xác nhận lưu', 'Bạn có chắc muốn lưu danh mục này?', () => {
      closeConfirm();
      void run(async () => {
        await apiPost(
          '/categories',
          {
            data: {
              name: newCategory.name,
              slug: newCategory.slug,
              description: newCategory.description,
              parent_id: newCategory.parentId || null,
            },
          },
          true,
        );
        setNewCategory({ name: '', slug: '', description: '', parentId: '' });
      }, 'Đã thêm danh mục');
    });
  };

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault();
    askConfirm('Xác nhận lưu', 'Bạn có chắc muốn lưu sản phẩm này?', () => {
      closeConfirm();
      void run(async () => {
        await apiPost(
          '/products',
          {
            data: {
              name: newProduct.name,
              slug: newProduct.slug,
              price: Number(newProduct.price || 0),
              stock: Number(newProduct.stock || 0),
              category_id: newProduct.categoryId || null,
              short_description: newProduct.shortDescription,
              description: newProduct.description,
              thumbnail_url: newProduct.thumbnailUrl,
            },
          },
          true,
        );
        setNewProduct({
          name: '',
          slug: '',
          price: '0',
          stock: '0',
          categoryId: '',
          shortDescription: '',
          description: '',
          thumbnailUrl: '',
        });
      }, 'Đã thêm sản phẩm');
    });
  };

  if (!sessionUser) {
    return <main className="rounded-2xl border border-[#d8cdb9] bg-white p-8">Đang kiểm tra đăng nhập...</main>;
  }

  return (
    <main className="space-y-8">
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onCancel={closeConfirm}
        onConfirm={() => confirmState.onConfirm?.()}
      />
      <section className="rounded-3xl border border-[#d8cdb9] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0B2D4D]">Quản trị sản phẩm và danh mục</h2>
            <p className="text-sm text-[#6b7280]">Đăng nhập: {sessionUser.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push('/admin/login');
            }}
            className="rounded-full border border-[#d8cdb9] px-4 py-2 text-sm font-semibold hover:bg-[#f7f1e5]"
          >
            Đăng xuất
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#d8cdb9] bg-[#f8f4ec] px-3 py-1 text-xs font-semibold text-[#334155]">
            Tổng danh mục: {categoriesTotal}
          </span>
          <span className="rounded-full border border-[#d8cdb9] bg-[#f8f4ec] px-3 py-1 text-xs font-semibold text-[#334155]">
            Danh mục cha: {categoriesParentTotal}
          </span>
          <span className="rounded-full border border-[#d8cdb9] bg-[#f8f4ec] px-3 py-1 text-xs font-semibold text-[#334155]">
            Danh mục con: {categoriesChildTotal}
          </span>
          <span className="rounded-full border border-[#d8cdb9] bg-[#f8f4ec] px-3 py-1 text-xs font-semibold text-[#334155]">
            Tổng sản phẩm: {productsTotal}
          </span>
        </div>
        {notice ? <p className="mt-4 text-sm font-semibold text-[#1f3158]">{notice}</p> : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submitCategory} className="rounded-3xl border border-[#d8cdb9] bg-white p-5">
          <h3 className="mb-3 text-xl font-bold text-[#0B2D4D]">Thêm danh mục</h3>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#334155]">Tên danh mục</label>
            <input value={newCategory.name} onChange={(e) => setNewCategory((v) => ({ ...v, name: e.target.value }))} placeholder="Ví dụ: Nến thơm phòng" className="w-full rounded-xl border px-3 py-2" required />
            <label className="block text-sm font-medium text-[#334155]">Slug</label>
            <input value={newCategory.slug} onChange={(e) => setNewCategory((v) => ({ ...v, slug: e.target.value }))} placeholder="Ví dụ: nen_thom_phong" className="w-full rounded-xl border px-3 py-2" required />
            <label className="block text-sm font-medium text-[#334155]">Mô tả ngắn</label>
            <input value={newCategory.description} onChange={(e) => setNewCategory((v) => ({ ...v, description: e.target.value }))} placeholder="Mô tả nội dung danh mục" className="w-full rounded-xl border px-3 py-2" />
            <label className="block text-sm font-medium text-[#334155]">Danh mục cha</label>
            <select value={newCategory.parentId} onChange={(e) => setNewCategory((v) => ({ ...v, parentId: e.target.value }))} className="w-full rounded-xl border px-3 py-2">
              <option value="">Không có danh mục cha</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button disabled={busy} className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu danh mục</button>
          </div>
        </form>

        <form onSubmit={submitProduct} className="rounded-3xl border border-[#d8cdb9] bg-white p-5">
          <h3 className="mb-3 text-xl font-bold text-[#0B2D4D]">Thêm sản phẩm</h3>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#334155]">Tên sản phẩm</label>
            <input value={newProduct.name} onChange={(e) => setNewProduct((v) => ({ ...v, name: e.target.value }))} placeholder="Ví dụ: Nến thơm Lavender" className="w-full rounded-xl border px-3 py-2" required />
            <label className="block text-sm font-medium text-[#334155]">Slug sản phẩm</label>
            <input value={newProduct.slug} onChange={(e) => setNewProduct((v) => ({ ...v, slug: e.target.value }))} placeholder="Ví dụ: nen_thom_lavender" className="w-full rounded-xl border px-3 py-2" required />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-[#64748b]">Giá tiền (VND)</label>
              <label className="text-xs text-[#64748b]">Số lượng</label>
              <input value={newProduct.price} onChange={(e) => setNewProduct((v) => ({ ...v, price: e.target.value }))} placeholder="Giá tiền" className="w-full rounded-xl border px-3 py-2" required />
              <input value={newProduct.stock} onChange={(e) => setNewProduct((v) => ({ ...v, stock: e.target.value }))} placeholder="Tồn kho" className="w-full rounded-xl border px-3 py-2" required />
            </div>
            <label className="block text-sm font-medium text-[#334155]">Danh mục sản phẩm</label>
            <select value={newProduct.categoryId} onChange={(e) => setNewProduct((v) => ({ ...v, categoryId: e.target.value }))} className="w-full rounded-xl border px-3 py-2">
              <option value="">Không gán danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <label className="block text-sm font-medium text-[#334155]">Mô tả ngắn</label>
            <input value={newProduct.shortDescription} onChange={(e) => setNewProduct((v) => ({ ...v, shortDescription: e.target.value }))} placeholder="1-2 câu mô tả ngắn cho thẻ sản phẩm" className="w-full rounded-xl border px-3 py-2" />
            <label className="block text-sm font-medium text-[#334155]">Mô tả chi tiết (editor)</label>
            <RichTextEditor
              value={newProduct.description}
              onChange={(value) => setNewProduct((v) => ({ ...v, description: value }))}
              placeholder="Nhập mô tả, bôi đen để in đậm/in nghiêng, thêm danh sách..."
            />
            <label className="block text-sm font-medium text-[#334155]">Link ảnh đại diện</label>
            <input value={newProduct.thumbnailUrl} onChange={(e) => setNewProduct((v) => ({ ...v, thumbnailUrl: e.target.value }))} placeholder="https://..." className="w-full rounded-xl border px-3 py-2" />
            <button disabled={busy} className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu sản phẩm</button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-[#d8cdb9] bg-white p-6">
        <h3 className="mb-5 text-2xl font-bold text-[#0B2D4D]">Danh mục</h3>
        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <input
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Tìm danh mục theo tên, slug..."
            className="rounded-xl border px-3 py-2"
          />
          <button
            type="button"
            onClick={() => {
              setCategorySearch('');
            }}
            className="rounded-xl border border-[#d8cdb9] px-3 py-2 text-sm font-semibold text-[#334155] hover:bg-[#f8f4ec]"
          >
            Xóa bộ lọc danh mục
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.filter((category) => !category.parent_id).map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onOpenChildren={
                childCategoriesMap.get(category.id)?.length
                  ? () => setSelectedParentCategoryId(category.id)
                  : undefined
              }
              onEdit={() => {
                setEditingCategoryId(category.id);
                setEditingCategory({
                  name: category.name,
                  slug: category.slug,
                  description: category.description || '',
                  parentId: category.parent_id || '',
                });
              }}
              onDelete={() =>
                askConfirm('Xác nhận xóa', `Bạn có chắc muốn xóa danh mục "${category.name}"?`, () => {
                  closeConfirm();
                  void run(async () => { await apiDelete(`/categories/${category.id}`, true); }, 'Đã xóa danh mục');
                })
              }
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
                  await apiPatch(
                    `/categories/${editingCategoryId}`,
                    {
                      data: {
                        name: editingCategory.name,
                        slug: editingCategory.slug,
                        description: editingCategory.description,
                        parent_id: editingCategory.parentId || null,
                      },
                    },
                    true,
                  );
                  setEditingCategoryId('');
                }, 'Đã cập nhật danh mục');
              });
            }}
            className="mt-5 grid gap-2 md:grid-cols-5"
          >
            <input value={editingCategory.name} onChange={(e) => setEditingCategory((v) => ({ ...v, name: e.target.value }))} className="rounded-xl border px-3 py-2" />
            <input value={editingCategory.slug} onChange={(e) => setEditingCategory((v) => ({ ...v, slug: e.target.value }))} className="rounded-xl border px-3 py-2" />
            <input value={editingCategory.description} onChange={(e) => setEditingCategory((v) => ({ ...v, description: e.target.value }))} className="rounded-xl border px-3 py-2" />
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
              await apiPost(
                '/categories',
                {
                  data: {
                    name: newChildCategory.name,
                    slug: newChildCategory.slug,
                    description: newChildCategory.description,
                    parent_id: selectedParentCategoryId,
                  },
                },
                true,
              );
              setNewChildCategory({ name: '', slug: '', description: '' });
            }, 'Đã thêm danh mục con');
          });
        }}
        onStartEditChild={(child) => {
          setEditingChildCategoryId(child.id);
          setEditingChildCategory({
            name: child.name,
            slug: child.slug,
            description: child.description || '',
          });
        }}
        onEditingChildChange={(field, value) => setEditingChildCategory((prev) => ({ ...prev, [field]: value }))}
        onSaveEditChild={() => {
          if (!editingChildCategoryId) return;
          askConfirm('Xác nhận lưu', 'Bạn có chắc muốn lưu sửa danh mục con này?', () => {
            closeConfirm();
            void run(async () => {
              await apiPatch(
                `/categories/${editingChildCategoryId}`,
                {
                  data: {
                    name: editingChildCategory.name,
                    slug: editingChildCategory.slug,
                    description: editingChildCategory.description,
                    parent_id: selectedParentCategoryId || null,
                  },
                },
                true,
              );
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
        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Tìm sản phẩm theo tên, slug..."
            className="rounded-xl border px-3 py-2"
          />
          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="rounded-xl border px-3 py-2"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={productStockFilter}
            onChange={(e) => setProductStockFilter(e.target.value as 'all' | 'in_stock' | 'out_of_stock')}
            className="rounded-xl border px-3 py-2"
          >
            <option value="all">Tất cả tồn kho</option>
            <option value="in_stock">Còn hàng</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setProductSearch('');
              setProductCategoryFilter('all');
              setProductStockFilter('all');
            }}
            className="rounded-xl border border-[#d8cdb9] px-3 py-2 text-sm font-semibold text-[#334155] hover:bg-[#f8f4ec]"
          >
            Xóa bộ lọc sản phẩm
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryMap.get(product.category_id || '') || 'Chưa phân loại'}
              defaultImage={defaultImage}
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
                });
              }}
              onDelete={() =>
                askConfirm('Xác nhận xóa', `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`, () => {
                  closeConfirm();
                  void run(async () => { await apiDelete(`/products/${product.id}`, true); }, 'Đã xóa sản phẩm');
                })
              }
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
                  setEditingProductId('');
                }, 'Đã cập nhật sản phẩm');
              });
            }}
            className="mt-5 grid gap-2 md:grid-cols-6"
          >
            <input value={editingProduct.name} onChange={(e) => setEditingProduct((v) => ({ ...v, name: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="Tên" />
            <div>
              <p className="mb-1 text-xs text-[#64748b]">Giá tiền (VND)</p>
              <input value={editingProduct.price} onChange={(e) => setEditingProduct((v) => ({ ...v, price: e.target.value }))} className="w-full rounded-xl border px-3 py-2" placeholder="Giá tiền" />
            </div>
            <div>
              <p className="mb-1 text-xs text-[#64748b]">Số lượng</p>
              <input value={editingProduct.stock} onChange={(e) => setEditingProduct((v) => ({ ...v, stock: e.target.value }))} className="w-full rounded-xl border px-3 py-2" placeholder="Kho" />
            </div>
            <select value={editingProduct.categoryId} onChange={(e) => setEditingProduct((v) => ({ ...v, categoryId: e.target.value }))} className="rounded-xl border px-3 py-2">
              <option value="">Không gán danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input value={editingProduct.shortDescription} onChange={(e) => setEditingProduct((v) => ({ ...v, shortDescription: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="Mô tả ngắn" />
            <div className="md:col-span-4">
              <RichTextEditor
                value={editingProduct.description}
                onChange={(value) => setEditingProduct((v) => ({ ...v, description: value }))}
                placeholder="Mô tả chi tiết sản phẩm (hỗ trợ in đậm, list, xuống dòng)"
              />
            </div>
            <button className="rounded-xl bg-[#0B2D4D] px-3 py-2 text-sm font-semibold text-white md:col-span-2">Lưu sửa sản phẩm</button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
