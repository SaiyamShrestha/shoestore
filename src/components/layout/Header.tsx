
"use client";

import Link from 'next/link';
import { ShoppingCart, UserCircle2, Menu, Search } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Shoes' },
  // { href: '/style-matcher', label: 'Style Matcher' }, // Removed
];

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const termToSearch = searchTerm.trim();
    if (termToSearch) {
      router.push(`/products?q=${encodeURIComponent(termToSearch)}`);
      setSearchTerm(''); 
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false); 
      }
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Logo />
        
        <div className="hidden md:flex items-center flex-1 justify-end max-w-3xl">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground hover:text-primary transition-colors font-medium">
                {link.label}
              </Link>
            ))}
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
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                     <SheetClose key={link.href} asChild>
                        <Link href={link.href} className="text-lg text-foreground hover:text-primary transition-colors py-2">
                          {link.label}
                        </Link>
                    </SheetClose>
                  ))}
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
