type ValueCardProps = {
  title: string;
  description: string;
};

export default function ValueCard({ title, description }: ValueCardProps) {
  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-[#0B2D4D]">{title}</h2>
      <p className="leading-7 text-gray-600">{description}</p>
    </div>
  );
}
