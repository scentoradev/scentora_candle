'use client';

import { useEffect, useState } from 'react';
import { apiGet, type ApiListResponse } from './api';

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  sort_order?: number;
  is_home_visible?: boolean;
};

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet<ApiListResponse<CategoryItem>>('/categories');
        const items = response.items ?? response.data ?? [];
        if (active) setCategories(items);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Load categories failed');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}

