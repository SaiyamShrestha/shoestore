"use client";

import { useState } from 'react';
import OutfitUploader from '@/components/style-matcher/OutfitUploader';
import RecommendedShoeCard from '@/components/style-matcher/RecommendedShoeCard';
import { recommendShoes } from '@/ai/flows/recommend-shoes-from-image';
import type { RecommendShoesOutput } from '@/ai/flows/recommend-shoes-from-image'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Lightbulb } from 'lucide-react';

const StyleMatcherPage = () => {
  const [recommendations, setRecommendations] = useState<RecommendShoesOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOutfitAnalysis = async (imageDataUrl: string) => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const result = await recommendShoes({ outfitImageDataUri: imageDataUrl });
      if (result && result.length > 0) {
        setRecommendations(result);
      } else {
        setError("Couldn't find any recommendations for this outfit. Try a different image!");
      }
    } catch (e) {
      console.error("AI Recommendation Error:", e);
      setError("An error occurred while analyzing your outfit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <OutfitUploader onImageUpload={handleOutfitAnalysis} isLoading={isLoading} />

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && recommendations.length === 0 && !error && (
         <Alert className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">Ready for Style?</AlertTitle>
            <AlertDescription className="text-primary/80">
              Upload an image of your outfit, and our AI will suggest the perfect shoes to complete your look!
            </AlertDescription>
          </Alert>
      )}

      {recommendations.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary">
            Our AI Recommends...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <RecommendedShoeCard key={index} recommendation={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StyleMatcherPage;
