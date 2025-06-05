import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/products/ProductCard';
import { getAllProducts } from '@/lib/mock-data';
import { ArrowRight, Search } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = getAllProducts().slice(0, 3); // Get first 3 products as featured

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground py-20 px-6 rounded-lg shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Decorative background pattern or image if desired */}
          {/* For example, a subtle shoe pattern */}
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-6 drop-shadow-md">
            Find Your Perfect Pair
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm">
            Discover the latest trends and timeless classics. Quality footwear for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/products" passHref>
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg transform hover:scale-105 transition-transform duration-300">
                Shop All Shoes <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/style-matcher" passHref>
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                AI Style Matcher <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold font-headline text-center mb-8 text-primary">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products" passHref>
              <Button variant="link" className="text-accent text-lg">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Why Choose Us Section (Example) */}
      <section className="bg-card p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold font-headline text-center mb-8 text-primary">Why Sole Mate?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <Image src="https://placehold.co/100x100.png/3F51B5/E8EAF6?text=Q" alt="Quality" width={80} height={80} className="mx-auto mb-4 rounded-full shadow-md" data-ai-hint="quality badge"/>
            <h3 className="text-xl font-semibold mb-2 font-headline text-secondary-foreground">Premium Quality</h3>
            <p className="text-muted-foreground">Handpicked selection of high-quality footwear from trusted brands.</p>
          </div>
          <div>
            <Image src="https://placehold.co/100x100.png/7E57C2/FFFFFF?text=S" alt="Style" width={80} height={80} className="mx-auto mb-4 rounded-full shadow-md" data-ai-hint="style icon"/>
            <h3 className="text-xl font-semibold mb-2 font-headline text-secondary-foreground">Latest Styles</h3>
            <p className="text-muted-foreground">Stay ahead of the curve with our curated collection of modern designs.</p>
          </div>
          <div>
            <Image src="https://placehold.co/100x100.png/3F51B5/E8EAF6?text=AI" alt="AI" width={80} height={80} className="mx-auto mb-4 rounded-full shadow-md" data-ai-hint="artificial intelligence"/>
            <h3 className="text-xl font-semibold mb-2 font-headline text-secondary-foreground">Smart Styling</h3>
            <p className="text-muted-foreground">Use our AI tool to find shoes that perfectly match your outfit.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
