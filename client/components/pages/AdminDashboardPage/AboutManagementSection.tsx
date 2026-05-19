'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { apiDelete, apiPatch, apiPost } from '@/hooks/api';
import RichTextEditor from '@/components/common/RichTextEditor';

type AboutPage = {
  id: string;
  type: 'policy' | 'blog' | 'hero' | 'about';
  title: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  is_published: boolean;
  sort_order: number;
};

type Props = {
  busy: boolean;
  aboutPages: AboutPage[];
  run: (action: () => Promise<void>, successMessage: string) => Promise<void>;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
};

export default function AboutManagementSection({
  busy,
  aboutPages,
  run,
  askConfirm,
  closeConfirm,
}: Props) {
  const [newAbout, setNewAbout] = useState({
    title: 'Giới thiệu',
    slug: 'gioi_thieu',
    summary: '',
    content: '',
    sortOrder: '0',
    isPublished: true,
  });
  const [editingId, setEditingId] = useState('');
  const [editingAbout, setEditingAbout] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    sortOrder: '0',
    isPublished: true,
  });

  const ordered = useMemo(
    () => [...aboutPages].sort((a, b) => a.sort_order - b.sort_order),
    [aboutPages],
  );

  const submitNew = (event: FormEvent) => {
    event.preventDefault();
    askConfirm('Xác nhận lưu', 'Bạn có chắc muốn thêm trang Giới thiệu này?', () => {
      closeConfirm();
      void run(async () => {
        await apiPost(
          '/content_pages',
          {
            data: {
              type: 'about',
              title: newAbout.title,
              slug: newAbout.slug,
              summary: newAbout.summary,
              content: newAbout.content || null,
              sort_order: Number(newAbout.sortOrder || 0),
              is_published: newAbout.isPublished,
            },
          },
          true,
        );
        setNewAbout({
          title: 'Giới thiệu',
          slug: 'gioi_thieu',
          summary: '',
          content: '',
          sortOrder: '0',
          isPublished: true,
        });
      }, 'Đã thêm trang Giới thiệu');
    });
  };

  const submitEdit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) return;
    askConfirm('Xác nhận lưu', 'Bạn có chắc muốn cập nhật trang Giới thiệu này?', () => {
      closeConfirm();
      void run(async () => {
        await apiPatch(
          `/content_pages/${editingId}`,
          {
            data: {
              type: 'about',
              title: editingAbout.title,
              slug: editingAbout.slug,
              summary: editingAbout.summary,
              content: editingAbout.content || null,
              sort_order: Number(editingAbout.sortOrder || 0),
              is_published: editingAbout.isPublished,
            },
          },
          true,
        );
        setEditingId('');
      }, 'Đã cập nhật trang Giới thiệu');
    });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-[#d8cdb9] bg-white p-6">
      <h3 className="text-2xl font-bold text-[#0B2D4D]">Quản lý trang Giới thiệu</h3>

      <form onSubmit={submitNew} className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4">
        <h4 className="text-lg font-bold text-[#0B2D4D]">Thêm trang Giới thiệu</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={newAbout.title}
            onChange={(e) => setNewAbout((v) => ({ ...v, title: e.target.value }))}
            className="rounded-xl border px-3 py-2"
            placeholder="Tiêu đề"
            required
          />
          <input
            value={newAbout.slug}
            onChange={(e) => setNewAbout((v) => ({ ...v, slug: e.target.value }))}
            className="rounded-xl border px-3 py-2"
            placeholder="Slug (ví dụ: gioi_thieu)"
            required
          />
        </div>
        <input
          value={newAbout.summary}
          onChange={(e) => setNewAbout((v) => ({ ...v, summary: e.target.value }))}
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Mô tả ngắn"
        />
        <RichTextEditor
          value={newAbout.content}
          onChange={(value) => setNewAbout((v) => ({ ...v, content: value }))}
          placeholder="Nội dung trang Giới thiệu"
          minHeight={220}
        />
        <div className="flex items-center gap-3">
          <input
            value={newAbout.sortOrder}
            onChange={(e) => setNewAbout((v) => ({ ...v, sortOrder: e.target.value }))}
            className="w-32 rounded-xl border px-3 py-2"
            placeholder="Thứ tự"
          />
          <label className="flex items-center gap-2 text-sm text-[#334155]">
            <input
              type="checkbox"
              checked={newAbout.isPublished}
              onChange={(e) => setNewAbout((v) => ({ ...v, isPublished: e.target.checked }))}
            />
            Hiển thị công khai
          </label>
          <button
            disabled={busy}
            className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white"
          >
            Lưu trang Giới thiệu
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#e7dccb]">
        <p className="border-b bg-[#f8f4ec] px-4 py-3 font-semibold text-[#0B2D4D]">Danh sách trang Giới thiệu</p>
        <table className="w-full text-sm">
          <tbody>
            {ordered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2">/{item.slug}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditingAbout({
                        title: item.title,
                        slug: item.slug,
                        summary: item.summary || '',
                        content: item.content || '',
                        sortOrder: String(item.sort_order || 0),
                        isPublished: item.is_published,
                      });
                    }}
                    className="rounded-full border px-3 py-1"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId ? (
        <form onSubmit={submitEdit} className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4">
          <h4 className="text-lg font-bold text-[#0B2D4D]">Sửa trang Giới thiệu</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={editingAbout.title}
              onChange={(e) => setEditingAbout((v) => ({ ...v, title: e.target.value }))}
              className="rounded-xl border px-3 py-2"
              placeholder="Tiêu đề"
              required
            />
            <input
              value={editingAbout.slug}
              onChange={(e) => setEditingAbout((v) => ({ ...v, slug: e.target.value }))}
              className="rounded-xl border px-3 py-2"
              placeholder="Slug"
              required
            />
          </div>
          <input
            value={editingAbout.summary}
            onChange={(e) => setEditingAbout((v) => ({ ...v, summary: e.target.value }))}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="Mô tả ngắn"
          />
          <RichTextEditor
            value={editingAbout.content}
            onChange={(value) => setEditingAbout((v) => ({ ...v, content: value }))}
            placeholder="Nội dung trang Giới thiệu"
            minHeight={220}
          />
          <div className="flex items-center gap-3">
            <input
              value={editingAbout.sortOrder}
              onChange={(e) => setEditingAbout((v) => ({ ...v, sortOrder: e.target.value }))}
              className="w-32 rounded-xl border px-3 py-2"
              placeholder="Thứ tự"
            />
            <label className="flex items-center gap-2 text-sm text-[#334155]">
              <input
                type="checkbox"
                checked={editingAbout.isPublished}
                onChange={(e) => setEditingAbout((v) => ({ ...v, isPublished: e.target.checked }))}
              />
              Hiển thị công khai
            </label>
            <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">
              Lưu cập nhật
            </button>
            <button
              type="button"
              onClick={() =>
                askConfirm('Xác nhận xóa', 'Bạn có chắc muốn xóa trang Giới thiệu này?', () => {
                  closeConfirm();
                  void run(async () => {
                    await apiDelete(`/content_pages/${editingId}`, true);
                    setEditingId('');
                  }, 'Đã xóa trang Giới thiệu');
                })
              }
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
