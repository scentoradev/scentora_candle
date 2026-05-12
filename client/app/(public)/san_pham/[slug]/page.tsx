import ProductSlugPage from '@/components/pages/ProductSlugPage/Index';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function Page({ params }: PageProps) {
  return <ProductSlugPage params={params} />;
}
