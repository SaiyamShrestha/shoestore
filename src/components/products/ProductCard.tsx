import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.slug}`} passHref className="block">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] relative w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={product.dataAiHint || 'shoe product'}
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.slug}`} passHref>
            <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors mb-1 truncate">
              {product.name}
            </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
        {product.tags && product.tags.length > 0 && (
          <div className="mb-2">
            <Badge variant="secondary">{product.category}</Badge>
          </div>
        )}
        <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/products/${product.slug}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
