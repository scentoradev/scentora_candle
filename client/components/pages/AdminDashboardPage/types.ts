export type AdminUser = { id: string; email: string };

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
};

export type Product = {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  stock: number;
  thumbnail_url?: string | null;
};
