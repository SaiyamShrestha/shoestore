
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/products/ProductCard';
import { getAllProducts } from '@/lib/mock-data';
import { ArrowRight, Search, Zap, ShieldCheck, Award } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = getAllProducts().slice(0, 3); // Get first 3 products as featured

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-accent text-primary-foreground py-24 px-6 rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 ">
          {/* You can add a subtle background pattern SVG or image here if desired */}
          {/* e.g. <Image src="/path/to/subtle-pattern.svg" layout="fill" objectFit="cover" alt="Background pattern" /> */}
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline mb-6 drop-shadow-lg">
            Step Into Your Style
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-12 max-w-3xl mx-auto drop-shadow-md">
            Discover footwear that defines you. From timeless classics to the latest trends, find your perfect pair with Sole Mate.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/products" passHref>
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-xl transform hover:scale-105 transition-transform duration-300 px-8 py-3 text-base">
                Shop All Shoes <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/style-matcher" passHref>
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground shadow-xl transform hover:scale-105 transition-transform duration-300 px-8 py-3 text-base">
                AI Style Matcher <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-4xl font-bold font-headline text-center mb-10 text-primary">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" passHref>
              <Button variant="link" className="text-accent hover:text-accent/80 text-lg font-medium">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="bg-card p-10 rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold font-headline text-center mb-10 text-primary">Why Sole Mate?</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 font-headline text-secondary-foreground">Premium Quality</h3>
            <p className="text-muted-foreground leading-relaxed">Handpicked selection of high-quality footwear from trusted brands.</p>
          </div>
          <div className="flex flex-col items-center">
             <div className="bg-accent/10 p-4 rounded-full mb-4">
              <Zap className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 font-headline text-secondary-foreground">Latest Styles</h3>
            <p className="text-muted-foreground leading-relaxed">Stay ahead of the curve with our curated collection of modern designs.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
             <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 font-headline text-secondary-foreground">Smart Styling</h3>
            <p className="text-muted-foreground leading-relaxed">Use our AI tool to find shoes that perfectly match your outfit.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
