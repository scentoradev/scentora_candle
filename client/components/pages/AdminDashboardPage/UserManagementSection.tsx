import type { FormEvent } from 'react';
import { apiDelete, apiPatch, apiPost } from '@/hooks/api';

type ManagedUser = {
  id: string;
  email: string;
  full_name?: string | null;
  role: 'admin';
};

type NewUserState = {
  email: string;
  fullName: string;
  password: string;
};

type EditingUserState = {
  fullName: string;
  password: string;
};

type Props = {
  sortedUsers: ManagedUser[];
  newUser: NewUserState;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserState>>;
  editingUserId: string;
  setEditingUserId: React.Dispatch<React.SetStateAction<string>>;
  editingUser: EditingUserState;
  setEditingUser: React.Dispatch<React.SetStateAction<EditingUserState>>;
  run: (action: () => Promise<void>, successMessage: string) => Promise<void>;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
};

export default function UserManagementSection({
  sortedUsers,
  newUser,
  setNewUser,
  editingUserId,
  setEditingUserId,
  editingUser,
  setEditingUser,
  run,
  askConfirm,
  closeConfirm,
}: Props) {
  const submitUser = (e: FormEvent) => {
    e.preventDefault();
    askConfirm('Xác nhận lưu', 'Bạn có chắc muốn thêm tài khoản admin này?', () => {
      closeConfirm();
      void run(async () => {
        await apiPost(
          '/users',
          {
            data: {
              email: newUser.email,
              full_name: newUser.fullName || null,
              password: newUser.password,
              role: 'admin',
            },
          },
          true,
        );
        setNewUser({ email: '', fullName: '', password: '' });
      }, 'Đã thêm tài khoản admin');
    });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-[#d8cdb9] bg-white p-6">
      <h3 className="text-2xl font-bold text-[#0B2D4D]">Quản lý người dùng</h3>

      <form onSubmit={submitUser} className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4">
        <h4 className="text-lg font-bold text-[#0B2D4D]">Thêm tài khoản admin</h4>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={newUser.email}
            onChange={(e) => setNewUser((v) => ({ ...v, email: e.target.value }))}
            placeholder="Email đăng nhập"
            type="email"
            className="rounded-xl border px-3 py-2"
            required
          />
          <input
            value={newUser.fullName}
            onChange={(e) => setNewUser((v) => ({ ...v, fullName: e.target.value }))}
            placeholder="Họ tên"
            className="rounded-xl border px-3 py-2"
          />
          <input
            value={newUser.password}
            onChange={(e) => setNewUser((v) => ({ ...v, password: e.target.value }))}
            placeholder="Mật khẩu"
            type="password"
            className="rounded-xl border px-3 py-2"
            required
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#0B2D4D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0B2D4D]">
            role: admin
          </span>
          <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu tài khoản</button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#e7dccb]">
        <p className="border-b bg-[#f8f4ec] px-4 py-3 font-semibold text-[#0B2D4D]">Danh sách người dùng</p>
        <table className="w-full text-sm">
          <thead className="bg-[#fcfaf6] text-left text-[#6b7280]">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Họ tên</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{item.full_name || '-'}</td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-[#0B2D4D]/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[#0B2D4D]">
                    admin
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUserId(item.id);
                        setEditingUser({ fullName: item.full_name || '', password: '' });
                      }}
                      className="rounded-full border px-3 py-1"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        askConfirm('Xác nhận xóa', `Bạn có chắc muốn xóa user "${item.email}"?`, () => {
                          closeConfirm();
                          void run(async () => {
                            await apiDelete(`/users/${item.id}`, true);
                            if (editingUserId === item.id) {
                              setEditingUserId('');
                            }
                          }, 'Đã xóa user');
                        })
                      }
                      className="rounded-full border border-red-200 px-3 py-1 text-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUserId ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askConfirm('Xác nhận lưu', 'Bạn có chắc muốn cập nhật user này?', () => {
              closeConfirm();
              void run(async () => {
                await apiPatch(
                  `/users/${editingUserId}`,
                  {
                    data: {
                      full_name: editingUser.fullName || null,
                      ...(editingUser.password ? { password: editingUser.password } : {}),
                    },
                  },
                  true,
                );
                setEditingUserId('');
                setEditingUser({ fullName: '', password: '' });
              }, 'Đã cập nhật user');
            });
          }}
          className="space-y-3 rounded-2xl border border-[#e7dccb] bg-[#fcfaf6] p-4"
        >
          <h4 className="text-lg font-bold text-[#0B2D4D]">Sửa người dùng</h4>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={editingUser.fullName}
              onChange={(e) => setEditingUser((v) => ({ ...v, fullName: e.target.value }))}
              className="rounded-xl border px-3 py-2"
              placeholder="Họ tên"
            />
            <input
              value={editingUser.password}
              onChange={(e) => setEditingUser((v) => ({ ...v, password: e.target.value }))}
              className="rounded-xl border px-3 py-2"
              placeholder="Mật khẩu mới (để trống nếu giữ nguyên)"
              type="password"
            />
            <div className="flex items-center">
              <span className="rounded-full bg-[#0B2D4D]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0B2D4D]">
                role: admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-[#0B2D4D] px-4 py-2 text-sm font-semibold text-white">Lưu sửa user</button>
            <button type="button" onClick={() => setEditingUserId('')} className="rounded-full border px-4 py-2 text-sm font-semibold">
              Hủy
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

