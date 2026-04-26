interface CardProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export function Card({ children, title, className = "" }: CardProps) {
  return (
    <div
      className={`h-full bg-[#11161c] border border-[#1f2630] rounded-xl p-3 ${className}`}
    >
      <h2 className="text-xs mb-2 text-gray-400 uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </div>
  );
}
