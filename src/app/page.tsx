
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/products/ProductCard';
import { getAllProducts } from '@/lib/mock-data';
import { ArrowRight, Zap, Award, Search } from 'lucide-react'; 

export default function HomePage() {
  const featuredProducts = getAllProducts().slice(0, 6); 

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/80 via-primary to-accent/70 text-primary-foreground py-24 px-6 rounded-xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 ">
          {/* Subtle pattern can go here */}
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline mb-6 drop-shadow-lg">
            Step Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground to-primary-foreground/70">Your Style</span>
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
            {/* AI Style Matcher button removed */}
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
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-full mb-4">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 font-headline text-card-foreground">Premium Quality</h3>
            <p className="text-muted-foreground leading-relaxed">Handpicked selection of high-quality footwear from trusted brands.</p>
          </div>
          <div className="flex flex-col items-center">
             <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-4 rounded-full mb-4">
              <Zap className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 font-headline text-card-foreground">Latest Styles</h3>
            <p className="text-muted-foreground leading-relaxed">Stay ahead of the curve with our curated collection of modern designs.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-full mb-4">
             <Search className="h-10 w-10 text-primary" /> {/* Changed icon from ShieldCheck to Search */}
            </div>
            <h3 className="text-2xl font-semibold mb-2 font-headline text-card-foreground">Effortless Discovery</h3> {/* Changed title */}
            <p className="text-muted-foreground leading-relaxed">Quickly find what you're looking for with our powerful search and intuitive filters.</p> {/* Changed description */}
          </div>
        </div>
      </section>
    </div>
  );
}
