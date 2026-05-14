export type ContentType = 'policy' | 'blog' | 'hero';

export interface ContentPageRecord {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

