import ProductSlugPageScreen from './ProductSlugPageScreen';

type ProductSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductSlugPage(props: ProductSlugPageProps) {
  return <ProductSlugPageScreen {...props} />;
}

