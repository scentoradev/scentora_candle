'use client';

import { useMemo } from 'react';
import { useDashboardCounts } from '@/hooks/useDashboardCounts';
import { useCategories } from '@/hooks/useCategories';

export default function AdminStatsPage() {
  const { loading, error, productsTotal, categoriesTotal, categoriesParentTotal, categoriesChildTotal, productByCategory } = useDashboardCounts();
  const { categories } = useCategories();

  const categoryNameMap = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  const chartRows = useMemo(() => {
    const rows = productByCategory.map((row) => ({
      key: row.category_id || 'khong_phan_loai',
      name: row.category_id ? categoryNameMap.get(row.category_id) || 'Danh mục không rõ' : 'Không phân loại',
      total: row.total,
    }));

    return rows.sort((a, b) => b.total - a.total).slice(0, 8);
  }, [productByCategory, categoryNameMap]);

  const maxValue = useMemo(() => Math.max(...chartRows.map((row) => row.total), 1), [chartRows]);

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-[#d8cdb9] bg-white p-6">
        <h1 className="text-3xl font-bold text-[#0B2D4D]">Thống kê</h1>
        <p className="mt-2 text-sm text-[#6b7280]">Tổng quan sản phẩm và danh mục theo dữ liệu hiện tại.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#e6dccb] bg-[#fbfaf7] p-4">
            <p className="text-sm text-[#6b7280]">Tổng sản phẩm</p>
            <p className="mt-2 text-2xl font-bold text-[#0B2D4D]">{productsTotal}</p>
          </div>
          <div className="rounded-2xl border border-[#e6dccb] bg-[#fbfaf7] p-4">
            <p className="text-sm text-[#6b7280]">Tổng danh mục</p>
            <p className="mt-2 text-2xl font-bold text-[#0B2D4D]">{categoriesTotal}</p>
          </div>
          <div className="rounded-2xl border border-[#e6dccb] bg-[#fbfaf7] p-4">
            <p className="text-sm text-[#6b7280]">Danh mục cha</p>
            <p className="mt-2 text-2xl font-bold text-[#0B2D4D]">{categoriesParentTotal}</p>
          </div>
          <div className="rounded-2xl border border-[#e6dccb] bg-[#fbfaf7] p-4">
            <p className="text-sm text-[#6b7280]">Danh mục con</p>
            <p className="mt-2 text-2xl font-bold text-[#0B2D4D]">{categoriesChildTotal}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#d8cdb9] bg-white p-6">
        <h2 className="text-2xl font-bold text-[#0B2D4D]">Biểu đồ sản phẩm theo danh mục</h2>
        {loading ? <p className="mt-4 text-sm text-[#6b7280]">Đang tải dữ liệu thống kê...</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-5 space-y-3">
            {chartRows.length === 0 ? <p className="text-sm text-[#6b7280]">Chưa có dữ liệu để hiển thị.</p> : null}
            {chartRows.map((row) => (
              <div key={row.key} className="grid grid-cols-[220px_1fr_60px] items-center gap-3">
                <p className="truncate text-sm font-medium text-[#334155]" title={row.name}>{row.name}</p>
                <div className="h-3 rounded-full bg-[#efe6d8]">
                  <div
                    className="h-3 rounded-full bg-[#0B2D4D]"
                    style={{ width: `${(row.total / maxValue) * 100}%` }}
                  />
                </div>
                <p className="text-right text-sm font-semibold text-[#0B2D4D]">{row.total}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
