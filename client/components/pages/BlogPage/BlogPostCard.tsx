import Image from 'next/image';

type BlogPostCardProps = {
  title: string;
  desc: string;
  image: string;
};

export default function BlogPostCard({ title, desc, image }: BlogPostCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-[280px] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="p-7">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#D4AF37]">Lifestyle</p>
        <h2 className="mb-4 text-2xl font-bold text-[#0B2D4D]">{title}</h2>
        <p className="leading-7 text-gray-600">{desc}</p>
        <button className="mt-6 rounded-full border border-[#0B2D4D] px-6 py-3 font-semibold text-[#0B2D4D]">Đọc thêm</button>
      </div>
    </article>
  );
}
