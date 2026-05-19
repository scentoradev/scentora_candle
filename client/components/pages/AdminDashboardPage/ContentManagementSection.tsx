import { apiDelete, apiPatch } from '@/hooks/api';
import RichTextEditor from '@/components/common/RichTextEditor';

type ContentType = 'policy' | 'blog' | 'hero' | 'about';

type ContentPage = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  is_published: boolean;
  sort_order: number;
};

type ContentEditorState = {
  type: ContentType;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  sortOrder: string;
  isPublished: boolean;
};

type NewPolicyState = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  sortOrder: string;
  isPublished: boolean;
};

type NewBlogState = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  sortOrder: string;
  isPublished: boolean;
};

type NewHeroState = {
  targetUrl: string;
  thumbnailUrl: string;
  extraBanners: string;
  sortOrder: string;
  isPublished: boolean;
};

type Props = {
  busy: boolean;
  policyPages: ContentPage[];
  blogPages: ContentPage[];
  heroPages: ContentPage[];
  newPolicy: NewPolicyState;
  setNewPolicy: React.Dispatch<React.SetStateAction<NewPolicyState>>;
  newBlog: NewBlogState;
  setNewBlog: React.Dispatch<React.SetStateAction<NewBlogState>>;
  newHero: NewHeroState;
  setNewHero: React.Dispatch<React.SetStateAction<NewHeroState>>;
  editingContentId: string;
  setEditingContentId: React.Dispatch<React.SetStateAction<string>>;
  editingContent: ContentEditorState;
  setEditingContent: React.Dispatch<React.SetStateAction<ContentEditorState>>;
  footerMapPage: ContentPage | null;
  footerBrandPage: ContentPage | null;
  createContentPage: (
    type: ContentType,
    payload: { title: string; slug: string; summary?: string; content?: string | null; thumbnailUrl?: string; sortOrder: string; isPublished: boolean },
  ) => Promise<void>;
  run: (action: () => Promise<void>, successMessage: string) => Promise<void>;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
  parseHeroExtraBanners: (value: string) => { imageUrl: string; targetUrl: string }[];
  toHeroSlug: () => string;
  footerMapSlug: string;
  footerBrandSlug: string;
};

export default function ContentManagementSection({
  busy: _busy,
  policyPages,
  blogPages,
  heroPages,
  newPolicy,
  setNewPolicy,
  newBlog,
  setNewBlog,
  newHero,
  setNewHero,
  editingContentId,
  setEditingContentId,
  editingContent,
  setEditingContent,
  footerMapPage,
  footerBrandPage,
  createContentPage,
  run,
  askConfirm,
  closeConfirm,
  parseHeroExtraBanners,
  toHeroSlug,
  footerMapSlug,
  footerBrandSlug,
}: Props) {
  return (
    <section className="space-y-6 rounded-3xl border border-[#d8cdb9] bg-white p-6">
      <h3 className="text-2xl font-bold text-[#0B2D4D]">Nội dung trang và Blog</h3>

      <div className="grid gap-6 xl:grid-cols-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askConfirm('Xác nhận lưu', 'Bạn có chắc muốn thêm trang chính sách này?', () => {
              closeConfirm();
              void run(async () => {
                await createContentPage('policy', newPolicy);
                setNewPolicy({ title: '', slug: '', summary: '', content: '', sortOrder: '0', isPublished: true });
              }, 'Đã thêm trang chính sách');
            });
          }}
          className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
        >
          <h4 className="text-lg font-bold text-[#0B2D4D]">Thêm trang chính sách</h4>
          <input value={newPolicy.title} onChange={(e) => setNewPolicy((v) => ({ ...v, title: e.target.value }))} placeholder="Tên trang" className="w-full rounded-xl border px-3 py-2" required />
          <input value={newPolicy.slug} onChange={(e) => setNewPolicy((v) => ({ ...v, slug: e.target.value }))} placeholder="slug" className="w-full rounded-xl border px-3 py-2" required />
          <input value={newPolicy.summary} onChange={(e) => setNewPolicy((v) => ({ ...v, summary: e.target.value }))} placeholder="Mô tả ngắn" className="w-full rounded-xl border px-3 py-2" />
          <RichTextEditor value={newPolicy.content} onChange={(value) => setNewPolicy((v) => ({ ...v, content: value }))} placeholder="Nội dung trang chính sách" minHeight={180} />
          <div className="flex items-center gap-3">
            <input value={newPolicy.sortOrder} onChange={(e) => setNewPolicy((v) => ({ ...v, sortOrder: e.target.value }))} placeholder="Thứ tự" className="w-32 rounded-xl border px-3 py-2" />
            <label className="flex items-center gap-2 text-sm text-[#334155]">
              <input type="checkbox" checked={newPolicy.isPublished} onChange={(e) => setNewPolicy((v) => ({ ...v, isPublished: e.target.checked }))} />
              Hiển thị công khai
            </label>
          </div>
          <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu trang chính sách</button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            askConfirm('Xác nhận lưu', 'Bạn có chắc muốn thêm bài blog này?', () => {
              closeConfirm();
              void run(async () => {
                await createContentPage('blog', newBlog);
                setNewBlog({ title: '', slug: '', summary: '', content: '', thumbnailUrl: '', sortOrder: '0', isPublished: true });
              }, 'Đã thêm bài blog');
            });
          }}
          className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
        >
          <h4 className="text-lg font-bold text-[#0B2D4D]">Thêm bài blog</h4>
          <input value={newBlog.title} onChange={(e) => setNewBlog((v) => ({ ...v, title: e.target.value }))} placeholder="Tiêu đề bài viết" className="w-full rounded-xl border px-3 py-2" required />
          <input value={newBlog.slug} onChange={(e) => setNewBlog((v) => ({ ...v, slug: e.target.value }))} placeholder="slug" className="w-full rounded-xl border px-3 py-2" required />
          <input value={newBlog.summary} onChange={(e) => setNewBlog((v) => ({ ...v, summary: e.target.value }))} placeholder="Mô tả ngắn" className="w-full rounded-xl border px-3 py-2" />
          <input value={newBlog.thumbnailUrl} onChange={(e) => setNewBlog((v) => ({ ...v, thumbnailUrl: e.target.value }))} placeholder="Ảnh đại diện (URL)" className="w-full rounded-xl border px-3 py-2" />
          <RichTextEditor value={newBlog.content} onChange={(value) => setNewBlog((v) => ({ ...v, content: value }))} placeholder="Nội dung bài viết blog" minHeight={180} />
          <div className="flex items-center gap-3">
            <input value={newBlog.sortOrder} onChange={(e) => setNewBlog((v) => ({ ...v, sortOrder: e.target.value }))} placeholder="Thứ tự" className="w-32 rounded-xl border px-3 py-2" />
            <label className="flex items-center gap-2 text-sm text-[#334155]">
              <input type="checkbox" checked={newBlog.isPublished} onChange={(e) => setNewBlog((v) => ({ ...v, isPublished: e.target.checked }))} />
              Hiển thị công khai
            </label>
          </div>
          <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu bài blog</button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            askConfirm('Xác nhận lưu', 'Bạn có chắc muốn thêm banner hero này?', () => {
              closeConfirm();
              void run(async () => {
                const slug = toHeroSlug();
                const extraLines = parseHeroExtraBanners(newHero.extraBanners).map((item) => `${item.imageUrl}|${item.targetUrl}`);
                await createContentPage('hero', {
                  title: `Banner ${new Date().toLocaleString('vi-VN')}`,
                  slug,
                  summary: newHero.targetUrl,
                  content: extraLines.join('\n') || null,
                  thumbnailUrl: newHero.thumbnailUrl,
                  sortOrder: newHero.sortOrder,
                  isPublished: newHero.isPublished,
                });
                setNewHero({ targetUrl: '', thumbnailUrl: '', extraBanners: '', sortOrder: '0', isPublished: true });
              }, 'Đã thêm banner hero');
            });
          }}
          className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
        >
          <h4 className="text-lg font-bold text-[#0B2D4D]">Thêm banner hero</h4>
          <input value={newHero.thumbnailUrl} onChange={(e) => setNewHero((v) => ({ ...v, thumbnailUrl: e.target.value }))} placeholder="Ảnh chính (URL)" className="w-full rounded-xl border px-3 py-2" required />
          <input value={newHero.targetUrl} onChange={(e) => setNewHero((v) => ({ ...v, targetUrl: e.target.value }))} placeholder="Link đích chính" className="w-full rounded-xl border px-3 py-2" />
          <textarea value={newHero.extraBanners} onChange={(e) => setNewHero((v) => ({ ...v, extraBanners: e.target.value }))} placeholder={'Ảnh phụ + link: image_url|target_url'} className="min-h-28 w-full rounded-xl border px-3 py-2" />
          <div className="flex items-center gap-3">
            <input value={newHero.sortOrder} onChange={(e) => setNewHero((v) => ({ ...v, sortOrder: e.target.value }))} placeholder="Thứ tự" className="w-32 rounded-xl border px-3 py-2" />
            <label className="flex items-center gap-2 text-sm text-[#334155]">
              <input type="checkbox" checked={newHero.isPublished} onChange={(e) => setNewHero((v) => ({ ...v, isPublished: e.target.checked }))} />
              Hiển thị công khai
            </label>
          </div>
          <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu banner</button>
        </form>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const footerMapUrlInput = String(formData.get('footer_map_url') || '').trim();
          askConfirm('Xác nhận lưu', 'Bạn có chắc muốn cập nhật link Google Map ở footer?', () => {
            closeConfirm();
            void run(async () => {
              if (footerMapPage?.id) {
                await apiPatch(`/content_pages/${footerMapPage.id}`, { data: { summary: footerMapUrlInput, is_published: true } }, true);
              } else {
                await createContentPage('policy', { title: 'Footer Google Map', slug: footerMapSlug, summary: footerMapUrlInput, content: null, sortOrder: '9999', isPublished: true });
              }
            }, 'Đã lưu link Google Map footer');
          });
        }}
        className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
      >
        <h4 className="text-lg font-bold text-[#0B2D4D]">Google Map Footer</h4>
        <input name="footer_map_url" key={footerMapPage?.id || 'footer-map-empty'} defaultValue={footerMapPage?.summary || ''} placeholder="https://maps.google.com/..." className="w-full rounded-xl border px-3 py-2" />
        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu link map</button>
          {footerMapPage?.id ? (
            <button
              type="button"
              onClick={() =>
                askConfirm('Xác nhận xóa', 'Bạn có chắc muốn xóa link Google Map footer?', () => {
                  closeConfirm();
                  void run(async () => {
                    await apiDelete(`/content_pages/${footerMapPage.id}`, true);
                  }, 'Đã xóa link Google Map footer');
                })
              }
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Xóa link map
            </button>
          ) : null}
        </div>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const brandName = String(formData.get('footer_brand_name') || '').trim();
          const brandTagline = String(formData.get('footer_brand_tagline') || '').trim();
          const brandDescription = String(formData.get('footer_brand_description') || '').trim();
          askConfirm('Xác nhận lưu', 'Bạn có chắc muốn cập nhật thông tin thương hiệu ở footer?', () => {
            closeConfirm();
            void run(async () => {
              if (footerBrandPage?.id) {
                await apiPatch(
                  `/content_pages/${footerBrandPage.id}`,
                  {
                    data: {
                      title: brandName,
                      summary: brandTagline,
                      content: brandDescription || null,
                      is_published: true,
                    },
                  },
                  true,
                );
              } else {
                await createContentPage('policy', {
                  title: brandName || 'Scentora Candle',
                  slug: footerBrandSlug,
                  summary: brandTagline || 'Xưởng hương thơm cao cấp',
                  content: brandDescription || null,
                  sortOrder: '9998',
                  isPublished: true,
                });
              }
            }, 'Đã lưu thông tin thương hiệu footer');
          });
        }}
        className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
      >
        <h4 className="text-lg font-bold text-[#0B2D4D]">Thông tin thương hiệu Footer</h4>
        <input
          name="footer_brand_name"
          key={`${footerBrandPage?.id || 'footer-brand-empty'}-name`}
          defaultValue={footerBrandPage?.title || 'Scentora Candle'}
          placeholder="Tên thương hiệu"
          className="w-full rounded-xl border px-3 py-2"
        />
        <input
          name="footer_brand_tagline"
          key={`${footerBrandPage?.id || 'footer-brand-empty'}-tagline`}
          defaultValue={footerBrandPage?.summary || 'Xưởng hương thơm cao cấp'}
          placeholder="Tagline thương hiệu"
          className="w-full rounded-xl border px-3 py-2"
        />
        <textarea
          name="footer_brand_description"
          key={`${footerBrandPage?.id || 'footer-brand-empty'}-description`}
          defaultValue={
            footerBrandPage?.content ||
            'Thắp sáng không gian, lan tỏa yêu thương. Bộ sưu tập nến thơm và tinh dầu mang đến cảm giác thư giãn, sang trọng và đầy cảm xúc cho từng khoảnh khắc.'
          }
          placeholder="Mô tả thương hiệu ở footer"
          className="min-h-28 w-full rounded-xl border px-3 py-2"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu thông tin thương hiệu</button>
          {footerBrandPage?.id ? (
            <button
              type="button"
              onClick={() =>
                askConfirm('Xác nhận xóa', 'Bạn có chắc muốn xóa thông tin thương hiệu footer?', () => {
                  closeConfirm();
                  void run(async () => {
                    await apiDelete(`/content_pages/${footerBrandPage.id}`, true);
                  }, 'Đã xóa thông tin thương hiệu footer');
                })
              }
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Xóa thông tin thương hiệu
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-[#e7dccb]">
          <p className="border-b bg-[#f8f4ec] px-4 py-3 font-semibold text-[#0B2D4D]">Danh sách trang chính sách</p>
          <table className="w-full text-sm">
            <tbody>
              {policyPages.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => { setEditingContentId(item.id); setEditingContent({ type: item.type, title: item.title, slug: item.slug, summary: item.summary || '', content: item.content || '', thumbnailUrl: item.thumbnail_url || '', sortOrder: String(item.sort_order), isPublished: item.is_published }); }} className="rounded-full border px-3 py-1">Sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#e7dccb]">
          <p className="border-b bg-[#f8f4ec] px-4 py-3 font-semibold text-[#0B2D4D]">Danh sách blog</p>
          <table className="w-full text-sm">
            <tbody>
              {blogPages.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => { setEditingContentId(item.id); setEditingContent({ type: item.type, title: item.title, slug: item.slug, summary: item.summary || '', content: item.content || '', thumbnailUrl: item.thumbnail_url || '', sortOrder: String(item.sort_order), isPublished: item.is_published }); }} className="rounded-full border px-3 py-1">Sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#e7dccb]">
          <p className="border-b bg-[#f8f4ec] px-4 py-3 font-semibold text-[#0B2D4D]">Danh sách hero</p>
          <table className="w-full text-sm">
            <tbody>
              {heroPages.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.thumbnail_url ? 'Có ảnh' : 'Không ảnh'}</td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => { setEditingContentId(item.id); setEditingContent({ type: item.type, title: item.title, slug: item.slug, summary: item.summary || '', content: item.content || '', thumbnailUrl: item.thumbnail_url || '', sortOrder: String(item.sort_order), isPublished: item.is_published }); }} className="rounded-full border px-3 py-1">Sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingContentId ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askConfirm('Xác nhận lưu', 'Bạn có chắc muốn cập nhật nội dung này?', () => {
              closeConfirm();
              void run(async () => {
                await apiPatch(`/content_pages/${editingContentId}`, {
                  data: {
                    type: editingContent.type,
                    title: editingContent.title,
                    slug: editingContent.slug,
                    summary: editingContent.summary,
                    content: editingContent.content,
                    thumbnail_url: editingContent.thumbnailUrl || null,
                    sort_order: Number(editingContent.sortOrder || 0),
                    is_published: editingContent.isPublished,
                  },
                }, true);
                setEditingContentId('');
              }, 'Đã cập nhật nội dung');
            });
          }}
          className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
        >
          <h4 className="text-lg font-bold text-[#0B2D4D]">Sửa nội dung</h4>
          <div className="grid gap-3 md:grid-cols-3">
            <select value={editingContent.type} onChange={(e) => setEditingContent((v) => ({ ...v, type: e.target.value as ContentType }))} className="rounded-xl border px-3 py-2">
              <option value="policy">Chính sách</option>
              <option value="blog">Blog</option>
              <option value="hero">Hero</option>
              <option value="about">Giới thiệu</option>
            </select>
            <input value={editingContent.title} onChange={(e) => setEditingContent((v) => ({ ...v, title: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="Tiêu đề" />
            <input value={editingContent.slug} onChange={(e) => setEditingContent((v) => ({ ...v, slug: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="Slug" />
          </div>
          <input value={editingContent.summary} onChange={(e) => setEditingContent((v) => ({ ...v, summary: e.target.value }))} className="w-full rounded-xl border px-3 py-2" placeholder="Mô tả / Link đích" />
          <input value={editingContent.thumbnailUrl} onChange={(e) => setEditingContent((v) => ({ ...v, thumbnailUrl: e.target.value }))} className="w-full rounded-xl border px-3 py-2" placeholder="Ảnh URL" />
          {editingContent.type === 'hero' ? (
            <textarea value={editingContent.content} onChange={(e) => setEditingContent((v) => ({ ...v, content: e.target.value }))} className="min-h-28 w-full rounded-xl border px-3 py-2" placeholder="Ảnh phụ + link" />
          ) : (
            <RichTextEditor value={editingContent.content} onChange={(value) => setEditingContent((v) => ({ ...v, content: value }))} placeholder="Nội dung chi tiết" minHeight={200} />
          )}
          <div className="flex items-center gap-3">
            <input value={editingContent.sortOrder} onChange={(e) => setEditingContent((v) => ({ ...v, sortOrder: e.target.value }))} className="w-32 rounded-xl border px-3 py-2" placeholder="Thứ tự" />
            <label className="flex items-center gap-2 text-sm text-[#334155]">
              <input type="checkbox" checked={editingContent.isPublished} onChange={(e) => setEditingContent((v) => ({ ...v, isPublished: e.target.checked }))} />
              Hiển thị công khai
            </label>
            <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu sửa nội dung</button>
            <button
              type="button"
              onClick={() => askConfirm('Xác nhận xóa', 'Bạn có chắc muốn xóa nội dung này?', () => {
                closeConfirm();
                void run(async () => {
                  await apiDelete(`/content_pages/${editingContentId}`, true);
                  setEditingContentId('');
                }, 'Đã xóa nội dung');
              })}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Xóa
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
