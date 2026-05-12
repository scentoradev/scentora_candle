'use client';

import { useEffect, useState } from 'react';
import { apiGet, type ApiListResponse } from './api';

export type ProductImageItem = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

export function useProductImages(productId?: string) {
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet<ApiListResponse<ProductImageItem>>('/product_images');
        const allItems = response.items ?? response.data ?? [];
        const filtered = productId
          ? allItems.filter((item) => item.product_id === productId)
          : allItems;

        if (active) setImages(filtered);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Load product images failed');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [productId]);

  return { images, loading, error };
}

