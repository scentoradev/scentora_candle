'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost, type ApiListResponse } from '@/hooks/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDashboardCounts } from '@/hooks/useDashboardCounts';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { AdminUser, Category, Product } from './types';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';
import ContentManagementSection from './ContentManagementSection';
import UserManagementSection from './UserManagementSection';
import CatalogManagementSection from './CatalogManagementSection';
import AboutManagementSection from './AboutManagementSection';


type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};
type ContentPage = {
  id: string;
  type: 'policy' | 'blog' | 'hero' | 'about';
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  is_published: boolean;
  sort_order: number;
};
type ManagedUser = {
  id: string;
  email: string;
  full_name?: string | null;
  role: 'admin';
  created_at?: string;
  updated_at?: string;
};
const FOOTER_MAP_SLUG = 'footer_google_map_link';
const FOOTER_BRAND_SLUG = 'footer_brand_profile';

const MOJIBAKE_PATTERN = /(?:Ã.|Ä.|Å.|Â.|áº|á»|á¼|á½|â€œ|â€|â€¦)/;

function normalizeUtf8Text(value: string): string {
  if (!value || !MOJIBAKE_PATTERN.test(value)) return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
}

function normalizeObjectText<T extends Record<string, unknown>>(item: T): T {
  const next = { ...item } as Record<string, unknown>;
  for (const [key, value] of Object.entries(next)) {
    if (typeof value === 'string') {
      next[key] = normalizeUtf8Text(value);
    }
  }
  return next as T;
}

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
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);

  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', parentId: '', sortOrder: '0', isHomeVisible: true });
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: '0',
    stock: '0',
    categoryId: '',
    shortDescription: '',
    description: '',
    thumbnailUrl: '',
    galleryUrls: '',
  });

  const [editingCategoryId, setEditingCategoryId] = useState('');
  const [editingCategory, setEditingCategory] = useState({ name: '', slug: '', description: '', parentId: '', sortOrder: '0', isHomeVisible: true });

  const [editingProductId, setEditingProductId] = useState('');
  const [editingProduct, setEditingProduct] = useState({
    name: '',
    price: '0',
    stock: '0',
    categoryId: '',
    shortDescription: '',
    description: '',
    thumbnailUrl: '',
    galleryUrls: '',
  });
  const [newChildCategory, setNewChildCategory] = useState({ name: '', slug: '', description: '', sortOrder: '0', isHomeVisible: true });
  const [editingChildCategoryId, setEditingChildCategoryId] = useState('');
  const [editingChildCategory, setEditingChildCategory] = useState({ name: '', slug: '', description: '', sortOrder: '0', isHomeVisible: true });
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [newPolicy, setNewPolicy] = useState({ title: '', slug: '', summary: '', content: '', sortOrder: '0', isPublished: true });
  const [newBlog, setNewBlog] = useState({ title: '', slug: '', summary: '', content: '', thumbnailUrl: '', sortOrder: '0', isPublished: true });
  const [newHero, setNewHero] = useState({ targetUrl: '', thumbnailUrl: '', extraBanners: '', sortOrder: '0', isPublished: true });
  const [editingContentId, setEditingContentId] = useState('');
  const [editingContent, setEditingContent] = useState({ type: 'policy' as 'policy' | 'blog' | 'hero' | 'about', title: '', slug: '', summary: '', content: '', thumbnailUrl: '', sortOrder: '0', isPublished: true });
  const [newUser, setNewUser] = useState({ email: '', fullName: '', password: '' });
  const [editingUserId, setEditingUserId] = useState('');
  const [editingUser, setEditingUser] = useState({ fullName: '', password: '' });
  const [activeAdminSection, setActiveAdminSection] = useState<'categories' | 'products' | 'content' | 'about' | 'users'>('categories');

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const orderedCategories = useMemo(
    () =>
      [...categories].sort((a, b) => {
        const aIsChild = Boolean(a.parent_id);
        const bIsChild = Boolean(b.parent_id);
        if (aIsChild !== bIsChild) return aIsChild ? 1 : -1;
        const sortDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
        if (sortDiff !== 0) return sortDiff;
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
  const policyPages = useMemo(
    () => contentPages.filter((item) => item.type === 'policy').sort((a, b) => a.sort_order - b.sort_order),
    [contentPages],
  );
  const blogPages = useMemo(
    () => contentPages.filter((item) => item.type === 'blog').sort((a, b) => a.sort_order - b.sort_order),
    [contentPages],
  );
  const heroPages = useMemo(
    () => contentPages.filter((item) => item.type === 'hero').sort((a, b) => a.sort_order - b.sort_order),
    [contentPages],
  );
  const aboutPages = useMemo(
    () => contentPages.filter((item) => item.type === 'about').sort((a, b) => a.sort_order - b.sort_order),
    [contentPages],
  );
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => (a.created_at && b.created_at ? (a.created_at < b.created_at ? 1 : -1) : 0)),
    [users],
  );
  const footerMapPage = useMemo(
    () => contentPages.find((item) => item.type === 'policy' && item.slug === FOOTER_MAP_SLUG) ?? null,
    [contentPages],
  );
  const footerBrandPage = useMemo(
    () => contentPages.find((item) => item.type === 'policy' && item.slug === FOOTER_BRAND_SLUG) ?? null,
    [contentPages],
  );

  const loadAll = async () => {
    const [categoriesRes, productsRes, productImagesRes, contentPagesRes, usersRes] = await Promise.allSettled([
      apiGet<ApiListResponse<Category>>('/categories'),
      apiGet<ApiListResponse<Product>>('/products?include_inactive=true', true),
      apiGet<ApiListResponse<ProductImage>>('/product_images'),
      apiGet<ApiListResponse<ContentPage>>('/content_pages'),
      apiGet<ApiListResponse<ManagedUser>>('/users', true),
    ]);
    if (categoriesRes.status === 'fulfilled') {
      const next = (categoriesRes.value.items ?? categoriesRes.value.data ?? []).map((item) =>
        normalizeObjectText(item),
      );
      setCategories(next);
    }
    if (productsRes.status === 'fulfilled') {
      const next = (productsRes.value.items ?? productsRes.value.data ?? []).map((item) =>
        normalizeObjectText(item),
      );
      setProducts(next);
    }
    if (productImagesRes.status === 'fulfilled') {
      const next = (productImagesRes.value.items ?? productImagesRes.value.data ?? []).map((item) =>
        normalizeObjectText(item),
      );
      setProductImages(next);
    }
    if (contentPagesRes.status === 'fulfilled') {
      const next = (contentPagesRes.value.items ?? contentPagesRes.value.data ?? []).map((item) =>
        normalizeObjectText(item),
      );
      setContentPages(next);
    }
    if (usersRes.status === 'fulfilled') {
      const next = (usersRes.value.items ?? usersRes.value.data ?? []).map((item) =>
        normalizeObjectText(item),
      );
      setUsers(next);
    }
  };

  const parseGalleryUrls = (value: string) =>
    value
      .split('\n')
      .map((item) => item.trim())
      .filter((item, index, array) => Boolean(item) && array.indexOf(item) === index);

  const toHeroSlug = () => `hero_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const parseHeroExtraBanners = (value: string) =>
    value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [imageUrl = '', targetUrl = ''] = line.split('|').map((part) => part.trim());
        return { imageUrl, targetUrl };
      })
      .filter((item) => Boolean(item.imageUrl));

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
      } catch {
        if (active) router.push('/admin/login');
        return;
      }

      try {
        await loadAll();
      } catch (error) {
        if (!active) return;
        setNotice(error instanceof Error ? error.message : 'Không thể tải dữ liệu danh mục/sản phẩm');
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
              sort_order: Number(newCategory.sortOrder || 0),
              is_home_visible: newCategory.isHomeVisible,
            },
          },
          true,
        );
        setNewCategory({ name: '', slug: '', description: '', parentId: '', sortOrder: '0', isHomeVisible: true });
      }, 'Đã thêm danh mục');
    });
  };

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault();
    askConfirm('Xác nhận lưu', 'Bạn có chắc muốn lưu sản phẩm này?', () => {
      closeConfirm();
      void run(async () => {
        const createdRes = await apiPost<{ data?: Product }>(
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
        const createdProduct = createdRes.data ?? null;
        const galleryUrls = parseGalleryUrls(newProduct.galleryUrls);
        if (createdProduct?.id && galleryUrls.length) {
          await Promise.all(
            galleryUrls.map((imageUrl, index) =>
              apiPost(
                '/product_images',
                {
                  data: {
                    product_id: createdProduct.id,
                    image_url: imageUrl,
                    sort_order: index,
                  },
                },
                true,
              ),
            ),
          );
        }
        setNewProduct({
          name: '',
          slug: '',
          price: '0',
          stock: '0',
          categoryId: '',
          shortDescription: '',
          description: '',
          thumbnailUrl: '',
          galleryUrls: '',
        });
      }, 'Đã thêm sản phẩm');
    });
  };

  const createContentPage = async (
    type: 'policy' | 'blog' | 'hero' | 'about',
    payload: { title: string; slug: string; summary?: string; content?: string | null; thumbnailUrl?: string; sortOrder: string; isPublished: boolean },
  ) => {
    await apiPost(
      '/content_pages',
      {
        data: {
          type,
          title: payload.title,
          slug: payload.slug,
          summary: payload.summary ?? '',
          content: payload.content ?? null,
          thumbnail_url: payload.thumbnailUrl || null,
          sort_order: Number(payload.sortOrder || 0),
          is_published: payload.isPublished,
        },
      },
      true,
    );
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

      <section className="rounded-3xl border border-[#d8cdb9] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveAdminSection('categories')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeAdminSection === 'categories'
                ? 'bg-[#0B2D4D] text-white'
                : 'border border-[#d8cdb9] bg-[#fcfaf6] text-[#334155] hover:bg-[#f6efe3]'
            }`}
          >
            Danh mục
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminSection('products')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeAdminSection === 'products'
                ? 'bg-[#0B2D4D] text-white'
                : 'border border-[#d8cdb9] bg-[#fcfaf6] text-[#334155] hover:bg-[#f6efe3]'
            }`}
          >
            Sản phẩm
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminSection('content')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeAdminSection === 'content'
                ? 'bg-[#0B2D4D] text-white'
                : 'border border-[#d8cdb9] bg-[#fcfaf6] text-[#334155] hover:bg-[#f6efe3]'
            }`}
          >
            Nội dung & Blog
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminSection('users')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeAdminSection === 'users'
                ? 'bg-[#0B2D4D] text-white'
                : 'border border-[#d8cdb9] bg-[#fcfaf6] text-[#334155] hover:bg-[#f6efe3]'
            }`}
          >
            Quản lý user
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminSection('about')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeAdminSection === 'about'
                ? 'bg-[#0B2D4D] text-white'
                : 'border border-[#d8cdb9] bg-[#fcfaf6] text-[#334155] hover:bg-[#f6efe3]'
            }`}
          >
            Trang Giới thiệu
          </button>
        </div>
      </section>

      {activeAdminSection === 'categories' ? (
        <CatalogManagementSection
          showCategorySection
          showProductSection={false}
          busy={busy}
          categories={categories}
          setCategories={setCategories}
          filteredCategories={filteredCategories}
          selectedParentCategoryId={selectedParentCategoryId}
          setSelectedParentCategoryId={setSelectedParentCategoryId}
          selectedParentCategory={selectedParentCategory}
          selectedParentChildren={selectedParentChildren}
          newChildCategory={newChildCategory}
          setNewChildCategory={setNewChildCategory}
          editingChildCategoryId={editingChildCategoryId}
          setEditingChildCategoryId={setEditingChildCategoryId}
          editingChildCategory={editingChildCategory}
          setEditingChildCategory={setEditingChildCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          editingCategoryId={editingCategoryId}
          setEditingCategoryId={setEditingCategoryId}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          categorySearch={categorySearch}
          setCategorySearch={setCategorySearch}
          submitCategory={submitCategory}
          productImages={productImages}
          filteredProducts={filteredProducts}
          categoryMap={categoryMap}
          defaultProductImage={DEFAULT_PRODUCT_IMAGE}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          submitProduct={submitProduct}
          productSearch={productSearch}
          setProductSearch={setProductSearch}
          productCategoryFilter={productCategoryFilter}
          setProductCategoryFilter={setProductCategoryFilter}
          productStockFilter={productStockFilter}
          setProductStockFilter={setProductStockFilter}
          editingProductId={editingProductId}
          setEditingProductId={setEditingProductId}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          parseGalleryUrls={parseGalleryUrls}
          run={run}
          askConfirm={askConfirm}
          closeConfirm={closeConfirm}
        />
      ) : null}

      {activeAdminSection === 'products' ? (
        <CatalogManagementSection
          showCategorySection={false}
          showProductSection
          busy={busy}
          categories={categories}
          setCategories={setCategories}
          filteredCategories={filteredCategories}
          selectedParentCategoryId={selectedParentCategoryId}
          setSelectedParentCategoryId={setSelectedParentCategoryId}
          selectedParentCategory={selectedParentCategory}
          selectedParentChildren={selectedParentChildren}
          newChildCategory={newChildCategory}
          setNewChildCategory={setNewChildCategory}
          editingChildCategoryId={editingChildCategoryId}
          setEditingChildCategoryId={setEditingChildCategoryId}
          editingChildCategory={editingChildCategory}
          setEditingChildCategory={setEditingChildCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          editingCategoryId={editingCategoryId}
          setEditingCategoryId={setEditingCategoryId}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          categorySearch={categorySearch}
          setCategorySearch={setCategorySearch}
          submitCategory={submitCategory}
          productImages={productImages}
          filteredProducts={filteredProducts}
          categoryMap={categoryMap}
          defaultProductImage={DEFAULT_PRODUCT_IMAGE}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          submitProduct={submitProduct}
          productSearch={productSearch}
          setProductSearch={setProductSearch}
          productCategoryFilter={productCategoryFilter}
          setProductCategoryFilter={setProductCategoryFilter}
          productStockFilter={productStockFilter}
          setProductStockFilter={setProductStockFilter}
          editingProductId={editingProductId}
          setEditingProductId={setEditingProductId}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          parseGalleryUrls={parseGalleryUrls}
          run={run}
          askConfirm={askConfirm}
          closeConfirm={closeConfirm}
        />
      ) : null}

      {activeAdminSection === 'content' ? (
        <ContentManagementSection
          busy={busy}
          policyPages={policyPages}
          blogPages={blogPages}
          heroPages={heroPages}
          newPolicy={newPolicy}
          setNewPolicy={setNewPolicy}
          newBlog={newBlog}
          setNewBlog={setNewBlog}
          newHero={newHero}
          setNewHero={setNewHero}
          editingContentId={editingContentId}
          setEditingContentId={setEditingContentId}
          editingContent={editingContent}
          setEditingContent={setEditingContent}
          footerMapPage={footerMapPage}
          footerBrandPage={footerBrandPage}
          createContentPage={createContentPage}
          run={run}
          askConfirm={askConfirm}
          closeConfirm={closeConfirm}
          parseHeroExtraBanners={parseHeroExtraBanners}
          toHeroSlug={toHeroSlug}
          footerMapSlug={FOOTER_MAP_SLUG}
          footerBrandSlug={FOOTER_BRAND_SLUG}
        />
      ) : null}

      {activeAdminSection === 'users' ? (
        <UserManagementSection
          sortedUsers={sortedUsers}
          newUser={newUser}
          setNewUser={setNewUser}
          editingUserId={editingUserId}
          setEditingUserId={setEditingUserId}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          run={run}
          askConfirm={askConfirm}
          closeConfirm={closeConfirm}
        />
      ) : null}

      {activeAdminSection === 'about' ? (
        <AboutManagementSection
          busy={busy}
          aboutPages={aboutPages}
          run={run}
          askConfirm={askConfirm}
          closeConfirm={closeConfirm}
        />
      ) : null}
    </main>
  );
}



