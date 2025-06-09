
"use client";

import type { Product, FilterOptions as FilterOptionsType } from '@/lib/types';
import { getAllProducts, getFilterOptions as fetchFilterOptions } from '@/lib/mock-data';
import ProductCard from '@/components/products/ProductCard';
import { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchParams, useRouter } from 'next/navigation';

const PRODUCTS_PER_PAGE = 3; // Changed from 9 to 3 to show pagination

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<ReturnType<typeof fetchFilterOptions> | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter(); 

  useEffect(() => {
    const productsData = getAllProducts();
    setAllProducts(productsData);
    const options = fetchFilterOptions();
    setFilterOptions(options);

    const querySearchTerm = searchParams.get('q');
    if (querySearchTerm) {
      setSearchTerm(querySearchTerm);
    }

    const queryCategory = searchParams.get('category');
    if (queryCategory) {
      setSelectedCategories([queryCategory]);
    }
  }, [searchParams]);

  useEffect(() => {
    let tempProducts = [...allProducts];

    if (searchTerm) {
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      tempProducts = tempProducts.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedSizes.length > 0) {
      tempProducts = tempProducts.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    if (selectedColors.length > 0) {
      tempProducts = tempProducts.filter(p => p.availableColors.some(c => selectedColors.includes(c)));
    }
    
    switch (sortBy) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setFilteredProducts(tempProducts);
    setCurrentPage(1); // Reset to first page when filters or sort order changes
  }, [searchTerm, selectedCategories, selectedBrands, selectedSizes, selectedColors, sortBy, allProducts]);

  const handleCheckboxFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy('name-asc');
    setCurrentPage(1);
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has('category')) {
      currentParams.delete('category');
    }
    if (currentParams.has('q')) {
        currentParams.delete('q');
    }
    router.push(`${window.location.pathname}?${currentParams.toString()}`);
  };
  
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (selectedColors.length > 0) count += selectedColors.length;
    return count;
  }, [searchTerm, selectedCategories, selectedBrands, selectedSizes, selectedColors]);


  if (!filterOptions) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  // Pagination logic
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProductsToDisplay = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const FilterSection = ({ title, items, selectedItems, onChange }: { title: string, items: string[], selectedItems: string[], onChange: (value: string) => void }) => (
    <AccordionItem value={title.toLowerCase()}>
      <AccordionTrigger className="font-semibold">{title}</AccordionTrigger>
      <AccordionContent>
        <ScrollArea className="h-40">
          <div className="space-y-2 pr-4">
            {items.map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`${title}-${item}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => onChange(item)}
                  aria-label={`Filter by ${title} ${item}`}
                />
                <Label htmlFor={`${title}-${item}`} className="font-normal cursor-pointer">{item}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
  
  const getPaginationRange = () => {
    const delta = 1; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    if (totalPages <= 1) {
      return range;
    }

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-1/4 xl:w-1/5 space-y-6 p-4 bg-card rounded-lg shadow-lg self-start sticky top-24">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-headline text-primary">Filters</h2>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4 mr-1" /> Reset All
            </Button>
          )}
        </div>
        
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search shoes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 mb-4"
              aria-label="Search products"
            />
        </div>

        <Accordion type="multiple" defaultValue={['category', 'brand']} className="w-full">
          <FilterSection title="Category" items={filterOptions.categories} selectedItems={selectedCategories} onChange={(val) => handleCheckboxFilterChange(setSelectedCategories, val)} />
          <FilterSection title="Brand" items={filterOptions.brands} selectedItems={selectedBrands} onChange={(val) => handleCheckboxFilterChange(setSelectedBrands, val)} />
          <FilterSection title="Size" items={filterOptions.sizes} selectedItems={selectedSizes} onChange={(val) => handleCheckboxFilterChange(setSelectedSizes, val)} />
          <FilterSection title="Color" items={filterOptions.colors} selectedItems={selectedColors} onChange={(val) => handleCheckboxFilterChange(setSelectedColors, val)} />
        </Accordion>
      </aside>

      <main className="w-full lg:w-3/4 xl:w-4/5">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline text-primary mb-4 sm:mb-0">
            {selectedCategories.length === 1 && !searchTerm ? `${selectedCategories[0]}` : "All Shoes"} ({filteredProducts.length})
          </h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Sort products by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {currentProductsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentProductsToDisplay.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-secondary-foreground">No products found</p>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
            {activeFilterCount > 0 && (
                <Button onClick={resetFilters} variant="link" className="mt-4 text-primary">Reset Filters</Button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {paginationRange.map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  aria-label={`Go to page ${page}`}
                  className="hidden sm:inline-flex" // Hide number buttons on very small screens
                >
                  {page}
                </Button>
              ) : (
                <span key={`dots-${index}`} className="px-1 sm:px-2 hidden sm:inline-block">...</span>
              )
            )}
             {/* Mobile page indicator */}
            <span className="sm:hidden text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;

    