import Image from 'next/image';
import Link from 'next/link';

type MainProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: string;
  tag: string;
  image: string;
};

export default function MainProductCard({ id, slug, name, price, tag, image }: MainProductCardProps) {
  return (
    <Link
      href={`/san_pham/${slug}`}
      key={id}
      className="group block overflow-hidden rounded-[28px] border border-[#eee2d2] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative h-[360px] overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover transition duration-700 group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full bg-[#0B2D4D] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">{tag}</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 min-h-[56px] text-xl font-semibold text-[#1f1f1f]">{name}</h3>
        <p className="text-2xl font-bold text-[#0B2D4D]">{price}</p>
      </div>
    </Link>
  );
}
