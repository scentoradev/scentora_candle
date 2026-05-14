import CatalogPageScreen from './CatalogPageScreen';

type CatalogPageProps = {
  title: string;
  subtitle: string;
  keyword?: string;
};

export default function CatalogPage(props: CatalogPageProps) {
  return <CatalogPageScreen {...props} />;
}

