import { toRichHtml } from '@/utils/richText';

type RichTextContentProps = {
  value?: string | null;
  className?: string;
  fallback?: string;
};

export default function RichTextContent({ value, className = '', fallback = '' }: RichTextContentProps) {
  const html = toRichHtml(value);
  const richClassName = [
    '[&_ul]:list-disc',
    '[&_ul]:pl-5',
    '[&_ul]:my-2',
    '[&_ol]:list-decimal',
    '[&_ol]:pl-5',
    '[&_ol]:my-2',
    '[&_li]:my-1',
    '[&_p]:my-1',
    className,
  ]
    .join(' ')
    .trim();

  if (!html) {
    return fallback ? <p className={richClassName}>{fallback}</p> : null;
  }

  return <div className={richClassName} dangerouslySetInnerHTML={{ __html: html }} />;
}
