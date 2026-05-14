'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/media';
import { formatVnd } from '@/utils/format';

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



function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function PublicNavbar() {
  const { categories } = useCategories();
  const { products } = useProducts();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const searchResults = useMemo(() => {
    const keyword = normalizeText(searchKeyword);
    if (!keyword) return [];
    return products
      .filter((product) => {
        const name = normalizeText(product.name || '');
        const slug = normalizeText(product.slug || '');
        const shortDescription = normalizeText(product.short_description || '');
        return name.includes(keyword) || slug.includes(keyword) || shortDescription.includes(keyword);
      })
      .slice(0, 6);
  }, [products, searchKeyword]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e1d5] bg-white">
      <div className="relative z-30 flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:h-26 xl:px-12 xl:py-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/logo.png"
            alt="Scentora Candle"
            width={80}
            height={80}
            className="h-14 w-auto rounded-full object-cover shadow-lg sm:h-16 xl:h-20"
          />

          <div>
            <h1 className="text-[18px] font-bold leading-tight tracking-wide text-[#0B2D4D] sm:text-[22px] xl:text-[28px]">
              Scentora Candle
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#b8933b] sm:text-[11px] xl:text-[12px] xl:tracking-[0.25em]">
              Xưởng hương thơm cao cấp
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
                <div className="invisible absolute left-1/2 top-full z-40 w-60 -translate-x-1/2 translate-y-2 border border-[#eee2d2] bg-white px-4 py-4 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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

              <div className="invisible absolute left-1/2 top-full z-40 w-55 -translate-x-1/2 translate-y-2 border border-[#eee2d2] bg-white px-3 py-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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
                        <div className="invisible absolute left-full top-0 z-40 ml-1 w-52.5 border border-[#eee2d2] bg-white px-3 py-3 opacity-0 shadow-xl transition-all duration-150 group-hover/item:visible group-hover/item:opacity-100">
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

        <div className="hidden items-center justify-end gap-4 text-[#0B2D4D] sm:flex">
          <a
            href="https://zalo.me/0938962062"
            target="_blank"
            className="rounded-full border border-[#35597d] bg-[#0B2D4D] px-5 py-2 text-[13px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#d4af37] hover:bg-[#133a61]"
            rel="noreferrer"
          >
            Liên hệ Zalo
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-full border border-[#d9c8ae] px-4 py-2 text-xs font-semibold text-[#223142] xl:hidden"
          aria-label="Mở menu"
          aria-expanded={mobileMenuOpen}
        >
          Menu
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-[#eef2f6] bg-white px-4 py-3 sm:px-6 xl:hidden">
          <nav className="space-y-2 text-sm font-semibold text-[#223142]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg border border-[#e7d5b6] px-3 py-2">
              Trang chủ
            </Link>
            {primaryCategoryItems.map((item) => (
              <div key={item.label} className="rounded-lg border border-[#e7d5b6] px-3 py-2">
                <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-[#223142]">
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 ? (
                  <div className="mt-2 space-y-1 border-l border-[#e7d5b6] pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-xs text-[#4f6174]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {overflowCategoryItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg border border-[#e7d5b6] px-3 py-2">
                {item.label}
              </Link>
            ))}
            <Link href="/gioi_thieu" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg border border-[#e7d5b6] px-3 py-2">
              Giới thiệu
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg border border-[#e7d5b6] px-3 py-2">
              Blog
            </Link>
            <a
              href="https://zalo.me/0938962062"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg bg-[#0B2D4D] px-3 py-2 text-center text-white"
            >
              Liên hệ Zalo
            </a>
          </nav>
        </div>
      ) : null}

      <div className="relative z-10 border-t border-[#eef2f6] bg-white px-4 py-3 sm:px-6 xl:px-12">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const query = searchKeyword.trim();
            if (!query) return;
            if (searchResults.length > 0) {
              router.push(`/san_pham/${searchResults[0].slug}`);
              return;
            }
          }}
          className="relative mx-auto flex w-full max-w-3xl items-center justify-center"
        >
          <div className="group flex h-12 w-full items-center gap-2 rounded-full border border-[#bfd9ef] bg-linear-to-r from-[#edf8ff] via-[#e5f5ff] to-[#d6eeff] pl-4 pr-2 shadow-[0_6px_22px_rgba(26,94,145,0.12),inset_0_1px_0_#fff] transition focus-within:border-[#57a7db] md:h-13 md:rounded-[999px_999px_999px_240px] md:pl-5">
            <span className="text-sm text-[#0B2D4D]/70">
              <FiSearch />
            </span>
            <input
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm sản phẩm theo tên, mùi hương..."
              className="w-full bg-transparent text-sm text-[#0B2D4D] placeholder:text-[#4a7ca0] outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[#0B2D4D] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#12406b]"
            >
              Tìm
            </button>
          </div>

          {searchKeyword.trim() ? (
            <div className="absolute left-0 right-0 top-14.5 z-50 overflow-hidden rounded-2xl border border-[#d4e7f5] bg-white shadow-[0_18px_42px_rgba(11,45,77,0.16)]">
              {searchResults.length > 0 ? (
                <ul className="max-h-96 overflow-auto py-2">
                  {searchResults.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/san_pham/${item.slug}`}
                        onClick={() => setSearchKeyword('')}
                        className="flex items-center gap-3 px-3 py-2 transition hover:bg-[#f2f9ff]"
                      >
                        <div className="h-14 w-14 overflow-hidden rounded-lg border border-[#e2edf6]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnail_url || DEFAULT_PRODUCT_IMAGE}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#0B2D4D]">{item.name}</p>
                          <p className="text-xs text-[#5f6b7a]">{formatVnd(item.price)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-4 text-sm text-[#5f6b7a]">Không tìm thấy sản phẩm phù hợp.</p>
              )}
            </div>
          ) : null}
        </form>
      </div>
    </header>
  );
}

