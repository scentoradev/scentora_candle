'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginForm from './AdminLoginForm';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/admin');
    } catch {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu quản trị.');
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 text-3xl font-bold text-[#0B2D4D]">Đăng nhập quản trị</h1>
      <AdminLoginForm
        email={email}
        password={password}
        error={error}
        loading={loading}
        onSubmit={onSubmit}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />
      <p className="mt-4 text-sm text-neutral-500">Phím tắt: Alt + A</p>
    </main>
  );
}
