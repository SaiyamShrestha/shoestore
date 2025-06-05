
"use client";

import Link from 'next/link';
import { ShoppingCart, UserCircle2, Menu, Search, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getFilterOptions } from '@/lib/mock-data';

const mainSiteLinks = [
  { href: '/', label: 'Home' },
  // Categories will be handled separately
];

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesPopoverOpen, setIsCategoriesPopoverOpen] = useState(false);

  useEffect(() => {
    const options = getFilterOptions();
    setCategories(options.categories);
  }, []);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const termToSearch = searchTerm.trim();
    if (termToSearch) {
      router.push(`/products?q=${encodeURIComponent(termToSearch)}`);
      setSearchTerm('');
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      setIsCategoriesPopoverOpen(false); // Close popover on search
    }
  };

  const handleCategoryLinkClick = () => {
    setIsCategoriesPopoverOpen(false);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Logo />
        
        <div className="hidden md:flex items-center flex-1 justify-start md:justify-center max-w-3xl">
          <nav className="flex items-center gap-1"> {/* Reduced gap for closer items */}
            {mainSiteLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors font-medium px-3 py-2">
                  {link.label}
                </Button>
              </Link>
            ))}
            {categories.length > 0 && (
              <Popover open={isCategoriesPopoverOpen} onOpenChange={setIsCategoriesPopoverOpen}>
                <PopoverTrigger asChild
                  onMouseEnter={() => setIsCategoriesPopoverOpen(true)}
                  onMouseLeave={() => setIsCategoriesPopoverOpen(false)}
                >
                  <Button variant="ghost" className="text-foreground hover:text-primary transition-colors font-medium px-3 py-2">
                    Categories <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCategoriesPopoverOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-0 border bg-popover text-popover-foreground shadow-md rounded-md"
                  onMouseEnter={() => setIsCategoriesPopoverOpen(true)}
                  onMouseLeave={() => setIsCategoriesPopoverOpen(false)}
                  sideOffset={5}
                >
                  <div className="p-1">
                    <Link href="/products" onClick={handleCategoryLinkClick} className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground">
                      All Shoes
                    </Link>
                    <hr className="my-1 border-border" />
                    {categories.map(category => (
                      <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} onClick={handleCategoryLinkClick} className="block px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground">
                        {category}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </nav>
          
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 ml-6">
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 w-40 lg:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search shoes"
            />
            <Button type="submit" variant="ghost" size="icon" className="h-9 w-9" aria-label="Submit search">
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="User Account">
            <UserCircle2 className="h-6 w-6" />
          </Button>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-2 mt-8">
                  {mainSiteLinks.map((link) => (
                     <SheetClose key={link.href} asChild>
                        <Link href={link.href} className="text-lg text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-accent/10">
                          {link.label}
                        </Link>
                    </SheetClose>
                  ))}
                  {categories.length > 0 && (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories-mobile" className="border-b-0">
                        <AccordionTrigger className="text-lg text-foreground hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-accent/10 hover:no-underline focus:no-underline">
                          <span className="flex-grow text-left">Categories</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <SheetClose asChild>
                            <Link href="/products" className="block text-md text-muted-foreground hover:text-primary transition-colors py-2 pl-6 pr-2 rounded-md hover:bg-accent/10">
                              All Shoes
                            </Link>
                          </SheetClose>
                          {categories.map(cat => (
                            <SheetClose key={cat} asChild>
                              <Link href={`/products?category=${encodeURIComponent(cat)}`} className="block text-md text-muted-foreground hover:text-primary transition-colors py-2 pl-6 pr-2 rounded-md hover:bg-accent/10">
                                {cat}
                              </Link>
                            </SheetClose>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </nav>
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mt-6 border-t pt-4">
                  <Input
                    type="search"
                    placeholder="Search shoes..."
                    className="h-10 flex-grow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search shoes (mobile)"
                  />
                  <Button type="submit" variant="ghost" size="icon" className="h-10 w-10" aria-label="Submit search (mobile)">
                    <Search className="h-5 w-5" />
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
