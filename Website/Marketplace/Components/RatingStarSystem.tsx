import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

type Props = {
  rating: number;
};

export default function RatingStars({ rating }: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        if (rating >= i + 1) {
          return <FaStar key={i} size={14} className="text-yellow-400" />;
        } else if (rating >= i + 0.5) {
          return <FaStarHalfAlt key={i} size={14} className="text-yellow-400" />;
        } else {
          return <FaRegStar key={i} size={14} className="text-gray-500" />;
        }
      })}
    </div>
  );
}
