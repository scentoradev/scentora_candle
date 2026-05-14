import ValueCard from './ValueCard';

const values = [
  {
    title: 'Tinh tế',
    description:
      'Mỗi sản phẩm được lựa chọn theo phong cách tối giản, sang trọng và dễ hòa hợp với nhiều không gian sống.',
  },
  {
    title: 'Ấm áp',
    description:
      'Hương thơm nhẹ nhàng giúp tạo cảm giác bình yên sau một ngày dài, như một khoảng nghỉ nhỏ cho tâm trí.',
  },
  {
    title: 'Quà tặng',
    description:
      'Scentora phù hợp làm quà tặng cho sinh nhật, kỷ niệm, tân gia hoặc những dịp cần một món quà có cảm xúc.',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="bg-[#0B2D4D] px-4 py-14 text-white sm:px-8 sm:py-24">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">Về Scentora</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl md:text-6xl">Thắp sáng không gian, lan tỏa yêu thương</h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
          Scentora Candle được tạo nên với mong muốn mang lại những sản phẩm nến thơm tinh tế, giúp mỗi căn phòng trở nên ấm áp, thư giãn và có dấu ấn riêng.
        </p>
      </section>

      <section className="grid gap-6 px-4 py-12 sm:gap-8 sm:px-8 sm:py-20 md:grid-cols-3 md:gap-10">
        {values.map((value) => (
          <ValueCard key={value.title} title={value.title} description={value.description} />
        ))}
      </section>

      <section className="px-4 pb-12 sm:px-8 sm:pb-20">
        <div className="rounded-[36px] bg-white p-5 shadow-sm sm:p-8 md:p-14">
          <h2 className="mb-5 text-3xl font-bold text-[#0B2D4D] sm:text-4xl">Câu chuyện thương hiệu</h2>
          <p className="max-w-4xl text-base leading-8 text-gray-700 sm:text-lg sm:leading-9">
            Với Scentora, nến không chỉ là vật trang trí. Đó là một cách để chăm sóc cảm xúc, làm mềm lại không gian và tạo nên những khoảnh khắc đáng nhớ. Chúng tôi hướng đến các sản phẩm đẹp, dễ dùng và truyền tải cảm giác bình yên trong từng chi tiết.
          </p>
        </div>
      </section>
    </main>
  );
}
