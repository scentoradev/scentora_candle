'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiGet } from './api';

type CountAllResponse = {
  total: number;
};

type CategoryCountByParentItem = {
  parent_id: string | null;
  total: number;
};

type ProductCountByCategoryItem = {
  category_id: string | null;
  total: number;
};

type CountByParentResponse = {
  items: CategoryCountByParentItem[];
};

type CountByCategoryResponse = {
  items: ProductCountByCategoryItem[];
};

export function useDashboardCounts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesTotal, setCategoriesTotal] = useState(0);
  const [productsTotal, setProductsTotal] = useState(0);
  const [categoryByParent, setCategoryByParent] = useState<CategoryCountByParentItem[]>([]);
  const [productByCategory, setProductByCategory] = useState<ProductCountByCategoryItem[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [categoriesAll, productsAll, categoriesParent, productsCategory] = await Promise.all([
          apiGet<CountAllResponse>('/categories/count/all'),
          apiGet<CountAllResponse>('/products/count/all'),
          apiGet<CountByParentResponse>('/categories/count/by-parent'),
          apiGet<CountByCategoryResponse>('/products/count/by-category'),
        ]);

        if (!active) return;
        setCategoriesTotal(categoriesAll.total ?? 0);
        setProductsTotal(productsAll.total ?? 0);
        setCategoryByParent(categoriesParent.items ?? []);
        setProductByCategory(productsCategory.items ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Load counts failed');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const categoriesParentTotal = useMemo(
    () => categoryByParent.find((row) => row.parent_id === null)?.total ?? 0,
    [categoryByParent],
  );
  const categoriesChildTotal = useMemo(
    () => categoryByParent.filter((row) => row.parent_id !== null).reduce((sum, row) => sum + row.total, 0),
    [categoryByParent],
  );

  return {
    loading,
    error,
    categoriesTotal,
    productsTotal,
    categoriesParentTotal,
    categoriesChildTotal,
    categoryByParent,
    productByCategory,
  };
}
