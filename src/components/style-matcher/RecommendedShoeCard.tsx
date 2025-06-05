import type { ShoeRecommendation } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface RecommendedShoeCardProps {
  recommendation: ShoeRecommendation;
}

const RecommendedShoeCard = ({ recommendation }: RecommendedShoeCardProps) => {
  // Simple heuristic to pick an AI hint based on keywords in description
  const getAiHint = (desc: string) => {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('sneaker')) return 'sneaker shoe';
    if (lowerDesc.includes('boot')) return 'boot shoe';
    if (lowerDesc.includes('sandal')) return 'sandal shoe';
    if (lowerDesc.includes('heel') || lowerDesc.includes('pump')) return 'heel shoe';
    if (lowerDesc.includes('loafer')) return 'loafer shoe';
    if (lowerDesc.includes('oxford')) return 'oxford shoe';
    return 'fashion shoe';
  };

  return (
    <Card className="overflow-hidden shadow-lg flex flex-col md:flex-row items-center">
      <div className="md:w-1/3 p-4">
        <div className="aspect-square relative w-full rounded-md overflow-hidden bg-secondary">
          <Image
            src={`https://placehold.co/400x400.png`} // Placeholder for AI generated shoe
            alt={recommendation.shoeDescription}
            fill
            sizes="(max-width: 768px) 80vw, 30vw"
            className="object-cover"
            data-ai-hint={getAiHint(recommendation.shoeDescription)}
          />
        </div>
      </div>
      <div className="md:w-2/3">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            {recommendation.shoeDescription}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base text-foreground/80">
            <strong>Why it matches:</strong> {recommendation.matchReason}
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
};

export default RecommendedShoeCard;
