import CategorySlugPage from '@/components/pages/CategorySlugPage/Index';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function Page({ params }: PageProps) {
  return <CategorySlugPage params={params} />;
}
