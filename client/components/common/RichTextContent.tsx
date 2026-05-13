import { toRichHtml } from '@/utils/richText';

type RichTextContentProps = {
  value?: string | null;
  className?: string;
  fallback?: string;
};

export default function RichTextContent({ value, className = '', fallback = '' }: RichTextContentProps) {
  const html = toRichHtml(value);
  const richClassName = [
    '[&_h1]:text-3xl',
    '[&_h1]:font-bold',
    '[&_h1]:leading-tight',
    '[&_h2]:text-2xl',
    '[&_h2]:font-bold',
    '[&_h2]:leading-tight',
    '[&_h3]:text-xl',
    '[&_h3]:font-semibold',
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
