'use client';

import { useEffect, useState } from 'react';
import { apiGet, type ApiListResponse } from './api';

export type ContentPageItem = {
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

type UseContentPagesParams = {
  type?: 'policy' | 'blog' | 'hero' | 'about';
  onlyPublished?: boolean;
};

export function useContentPages(params?: UseContentPagesParams) {
  const [items, setItems] = useState<ContentPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const search = new URLSearchParams();
        if (params?.type) search.set('type', params.type);
        if (params?.onlyPublished) search.set('is_published', 'true');
        const query = search.toString();
        const response = await apiGet<ApiListResponse<ContentPageItem>>(`/content_pages${query ? `?${query}` : ''}`);
        const list = response.items ?? response.data ?? [];
        if (active) setItems(list);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Load content pages failed');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [params?.type, params?.onlyPublished]);

  return { items, loading, error };
}

