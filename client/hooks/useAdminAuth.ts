'use client';

import { useState } from 'react';
import { apiGet, apiPost, type ApiItemResponse } from './api';

type AdminUser = {
  id: string;
  email: string;
  full_name?: string | null;
  role: string;
};

type LoginResponse = {
  access_token: string;
  user: AdminUser;
};

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiPost<LoginResponse>('/auth/login', { email, password });
      localStorage.setItem('admin_access_token', response.access_token);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const me = async () => {
    return apiGet<AdminUser>('/auth/me', true);
  };

  const logout = async () => {
    await apiPost<ApiItemResponse<{ message: string }>>('/auth/logout', {}, true);
    localStorage.removeItem('admin_access_token');
  };

  return { login, me, logout, loading };
}

