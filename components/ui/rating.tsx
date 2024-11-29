import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  className?: string;
}

export function Rating({ value, className }: RatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{value.toFixed(1)}</span>
    </div>
  );
}