'use client';

import BlogPostCard from './BlogPostCard';

const posts = [
  {
    title: 'Cách chọn nến thơm phù hợp cho phòng ngủ',
    desc: 'Gợi ý chọn mùi hương nhẹ nhàng giúp thư giãn và tạo cảm giác dễ ngủ.',
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200',
  },
  {
    title: 'Nến thơm có thể làm quà tặng như thế nào?',
    desc: 'Một món quà nhỏ nhưng có cảm xúc, phù hợp cho nhiều dịp đặc biệt.',
    image:
      'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=1200',
  },
  {
    title: 'Mẹo decor không gian sống với nến',
    desc: 'Biến góc bàn, phòng khách hoặc phòng ngủ trở nên ấm áp và tinh tế.',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200',
  },
];

export default function BlogPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="bg-[#0B2D4D] px-8 py-20 text-white">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">Scentora Journal</p>
        <h1 className="text-5xl font-bold">Blog</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
          Những chia sẻ nhỏ về nến thơm, mùi hương, decor và cách chăm sóc
          không gian sống.
        </p>
      </section>

      <section className="px-8 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <BlogPostCard key={index} title={post.title} desc={post.desc} image={post.image} />
          ))}
        </div>
      </section>
    </main>
  );
}
