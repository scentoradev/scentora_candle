import { FormEvent } from 'react';

type AdminLoginFormProps = {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  onSubmit: (event: FormEvent) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
};

export default function AdminLoginForm({
  email,
  password,
  error,
  loading,
  onSubmit,
  onEmailChange,
  onPasswordChange,
}: AdminLoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border p-6">
      <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="Email quản trị" className="w-full rounded-lg border px-4 py-3" required />
      <input type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} placeholder="Mật khẩu" className="w-full rounded-lg border px-4 py-3" required />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#0B2D4D] px-4 py-3 font-semibold text-white">
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
