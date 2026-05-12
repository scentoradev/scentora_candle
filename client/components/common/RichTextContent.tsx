import { toRichHtml } from '@/utils/richText';

type RichTextContentProps = {
  value?: string | null;
  className?: string;
  fallback?: string;
};

export default function RichTextContent({ value, className = '', fallback = '' }: RichTextContentProps) {
  const html = toRichHtml(value);

  if (!html) {
    return fallback ? <p className={className}>{fallback}</p> : null;
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
