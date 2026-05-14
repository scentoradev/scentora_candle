import CategorySlugPageScreen from './CategorySlugPageScreen';

type CategorySlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function CategorySlugPage(props: CategorySlugPageProps) {
  return <CategorySlugPageScreen {...props} />;
}

