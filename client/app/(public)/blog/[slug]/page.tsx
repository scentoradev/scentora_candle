import BlogDetailPage from '@/components/pages/BlogPage/DetailPage';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function Page({ params }: PageProps) {
  return <BlogDetailPage params={params} />;
}
