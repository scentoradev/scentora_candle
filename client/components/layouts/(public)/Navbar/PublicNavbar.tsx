'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';

type NavCategory = {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
};

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export default function PublicNavbar() {
  const { categories } = useCategories();

  const { primaryCategoryItems, overflowCategoryItems } = useMemo(() => {
    const excludedSlugs = new Set(['gioi_thieu', 'blog']);
    const navCategories = categories.filter((category) => !excludedSlugs.has(category.slug)) as NavCategory[];

    const childrenByParent = new Map<string, NavCategory[]>();
    navCategories.forEach((category) => {
      if (!category.parent_id) return;
      const list = childrenByParent.get(category.parent_id) ?? [];
      list.push(category);
      childrenByParent.set(category.parent_id, list);
    });

    const topLevel = navCategories.filter((category) => !category.parent_id);

    const topLevelItems = topLevel.map((category): NavItem => ({
        label: category.name,
        href: `/${category.slug}`,
        children: (childrenByParent.get(category.id) ?? []).map((child): NavChild => ({
          label: child.name,
          href: `/${child.slug}`,
        })),
      }));

    return {
      primaryCategoryItems: topLevelItems.slice(0, 5),
      overflowCategoryItems: topLevelItems.slice(5),
    };
  }, [categories]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e1d5] bg-white">
      <div className="flex h-26 w-full items-center justify-between px-12">
        <div className="flex min-w-65 items-center gap-4">
          <Image
            src="/logo.png"
            alt="Scentora Candle"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover shadow-lg"
          />

          <div>
            <h1 className="text-[28px] font-bold leading-tight tracking-wide text-[#0B2D4D]">
              Scentora Candle
            </h1>
            <p className="text-[12px] uppercase tracking-[0.25em] text-[#b8933b]">
              Xuong huong thom cao cap
            </p>
          </div>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-3 text-[18px] font-semibold text-[#2f2f2f] xl:flex">
          <div className="group relative">
            <Link
              href="/"
              className="flex h-11 items-center gap-2 rounded-full border border-[#d9c8ae] px-4 text-[12px] font-semibold tracking-[0.02em] text-[#223142] transition hover:-translate-y-0.5 hover:border-[#b8933b] hover:bg-[#fff7ea] hover:text-[#9d742f]"
            >
              Trang chủ
            </Link>
          </div>

          {primaryCategoryItems.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex h-11 items-center gap-2 rounded-full border border-[#d9c8ae] px-4 text-[12px] font-semibold tracking-[0.02em] text-[#223142] transition hover:-translate-y-0.5 hover:border-[#b8933b] hover:bg-[#fff7ea] hover:text-[#9d742f]"
              >
                {item.label}
                {item.children && item.children.length > 0 ? <span className="text-[11px] transition group-hover:rotate-180">v</span> : null}
              </Link>

              {item.children && item.children.length > 0 ? (
                <div className="invisible absolute left-1/2 top-full w-[240px] -translate-x-1/2 translate-y-2 border border-[#eee2d2] bg-white px-4 py-4 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="space-y-2">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link href={child.href} className="block rounded-lg border border-transparent px-2 py-1 text-[12px] font-medium text-[#555] transition hover:border-[#e7d5b6] hover:bg-[#fff9ef] hover:translate-x-1 hover:text-[#0B2D4D]">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}

          {overflowCategoryItems.length > 0 ? (
            <div className="group relative">
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-full border border-[#d9c8ae] px-4 text-[12px] font-semibold tracking-[0.02em] text-[#223142] transition hover:-translate-y-0.5 hover:border-[#b8933b] hover:bg-[#fff7ea] hover:text-[#9d742f]"
              >
                Thêm
                <span className="text-[11px] transition group-hover:rotate-180">v</span>
              </button>

              <div className="invisible absolute left-1/2 top-full w-[220px] -translate-x-1/2 translate-y-2 border border-[#eee2d2] bg-white px-3 py-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <ul className="space-y-1">
                  {overflowCategoryItems.map((item) => (
                    <li key={item.label} className="group/item relative">
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-lg border border-transparent px-2 py-1 text-[12px] font-medium text-[#555] transition hover:border-[#e7d5b6] hover:bg-[#fff9ef] hover:text-[#0B2D4D]"
                      >
                        <span>{item.label}</span>
                        {item.children && item.children.length > 0 ? <span className="text-[11px]">›</span> : null}
                      </Link>

                      {item.children && item.children.length > 0 ? (
                        <div className="invisible absolute left-full top-0 ml-1 w-[210px] border border-[#eee2d2] bg-white px-3 py-3 opacity-0 shadow-xl transition-all duration-150 group-hover/item:visible group-hover/item:opacity-100">
                          <ul className="space-y-1">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  className="block rounded-lg border border-transparent px-2 py-1 text-[12px] font-medium text-[#555] transition hover:border-[#e7d5b6] hover:bg-[#fff9ef] hover:text-[#0B2D4D]"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="group relative">
            <Link
              href="/gioi_thieu"
              className="flex h-11 items-center gap-2 rounded-full border border-[#d9c8ae] px-4 text-[12px] font-semibold tracking-[0.02em] text-[#223142] transition hover:-translate-y-0.5 hover:border-[#b8933b] hover:bg-[#fff7ea] hover:text-[#9d742f]"
            >
              Giới thiệu
            </Link>
          </div>

          <div className="group relative">
            <Link
              href="/blog"
              className="flex h-11 items-center gap-2 rounded-full border border-[#d9c8ae] px-4 text-[12px] font-semibold tracking-[0.02em] text-[#223142] transition hover:-translate-y-0.5 hover:border-[#b8933b] hover:bg-[#fff7ea] hover:text-[#9d742f]"
            >
              Blog
            </Link>
          </div>
        </nav>

        <div className="flex min-w-45 items-center justify-end gap-6 text-[#0B2D4D]">
          <button className="relative text-2xl">
            <a
              href="https://zalo.me/0938962062"
              target="_blank"
              className="rounded-full border border-[#35597d] bg-[#0B2D4D] px-5 py-2 text-[13px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#133a61]"
            >
              Liên hệ Zalo
            </a>
            <span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-[12px] font-bold text-[#0B2D4D]">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
