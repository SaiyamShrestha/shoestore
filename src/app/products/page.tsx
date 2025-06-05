"use client";

import type { Product, FilterOptions as FilterOptionsType } from '@/lib/types';
import { getAllProducts, getFilterOptions as fetchFilterOptions } from '@/lib/mock-data';
import ProductCard from '@/components/products/ProductCard';
import { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, X, Filter } from 'lucide-react'; 
import { ScrollArea } from '@/components/ui/scroll-area';

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<ReturnType<typeof fetchFilterOptions> | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Default will be updated
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    const productsData = getAllProducts();
    setAllProducts(productsData);
    setFilteredProducts(productsData); // Initially show all products
    const options = fetchFilterOptions();
    setFilterOptions(options);
    setPriceRange([0, options.maxPrice]); // Set initial price range from data
  }, []);

  useEffect(() => {
    let tempProducts = [...allProducts];

    // Search term filter
    if (searchTerm) {
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter(p => selectedCategories.includes(p.category));
    }
    // Brand filter
    if (selectedBrands.length > 0) {
      tempProducts = tempProducts.filter(p => selectedBrands.includes(p.brand));
    }
    // Size filter
    if (selectedSizes.length > 0) {
      tempProducts = tempProducts.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    // Color filter
    if (selectedColors.length > 0) {
      tempProducts = tempProducts.filter(p => p.availableColors.some(c => selectedColors.includes(c)));
    }
    // Price range filter
    tempProducts = tempProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
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
      default: // Newest or default
        break;
    }
    setFilteredProducts(tempProducts);
  }, [searchTerm, selectedCategories, selectedBrands, selectedSizes, selectedColors, priceRange, sortBy, allProducts]);

  const handleCheckboxFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    if (filterOptions) setPriceRange([0, filterOptions.maxPrice]);
    setSortBy('name-asc');
  };
  
  const activeFilterCount = useMemo(() => {
    return (searchTerm ? 1 : 0) +
           selectedCategories.length +
           selectedBrands.length +
           selectedSizes.length +
           selectedColors.length +
           (filterOptions && (priceRange[0] !== 0 || priceRange[1] !== filterOptions.maxPrice) ? 1 : 0);
  }, [searchTerm, selectedCategories, selectedBrands, selectedSizes, selectedColors, priceRange, filterOptions]);


  if (!filterOptions) {
    return <div className="text-center py-10">Loading products...</div>;
  }

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
                />
                <Label htmlFor={`${title}-${item}`} className="font-normal cursor-pointer">{item}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
  

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-1/4 xl:w-1/5 space-y-6 p-4 bg-card rounded-lg shadow-lg self-start sticky top-24">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-headline text-primary">Filters</h2>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4 mr-1" /> Reset
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
            />
        </div>


        <Accordion type="multiple" defaultValue={['category', 'brand']} className="w-full">
          <FilterSection title="Category" items={filterOptions.categories} selectedItems={selectedCategories} onChange={(val) => handleCheckboxFilterChange(setSelectedCategories, val)} />
          <FilterSection title="Brand" items={filterOptions.brands} selectedItems={selectedBrands} onChange={(val) => handleCheckboxFilterChange(setSelectedBrands, val)} />
          <FilterSection title="Size" items={filterOptions.sizes} selectedItems={selectedSizes} onChange={(val) => handleCheckboxFilterChange(setSelectedSizes, val)} />
          <FilterSection title="Color" items={filterOptions.colors} selectedItems={selectedColors} onChange={(val) => handleCheckboxFilterChange(setSelectedColors, val)} />
          
          <AccordionItem value="price">
            <AccordionTrigger className="font-semibold">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Slider
                  min={0}
                  max={filterOptions.maxPrice}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="my-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </aside>

      {/* Products Grid */}
      <main className="w-full lg:w-3/4 xl:w-4/5">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline text-primary mb-4 sm:mb-0">
            All Shoes ({filteredProducts.length})
          </h1>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
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
      </main>
    </div>
  );
};

export default ProductsPage;
