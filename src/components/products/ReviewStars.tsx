import { Star, StarHalf } from 'lucide-react';

interface ReviewStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

const ReviewStars = ({ rating, size = 20, className }: ReviewStarsProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center text-amber-400 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" size={size} />
      ))}
      {halfStar && <StarHalf key="half" fill="currentColor" size={size} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-muted-foreground/50" />
      ))}
    </div>
  );
};

export default ReviewStars;
