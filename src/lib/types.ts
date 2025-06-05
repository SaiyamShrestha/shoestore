export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  images: string[]; // URLs
  sizes: string[];
  availableColors: string[]; // color names or hex
  category: string; // e.g., 'sneakers', 'boots', 'sandals'
  reviews: ProductReview[];
  slug: string; // for URL
  stock: number;
  tags?: string[];
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShoeRecommendation {
  shoeDescription: string;
  matchReason: string;
}

export type FilterOptions = {
  sizes: string[];
  colors: string[];
  brands: string[];
  categories: string[];
  priceRange: [number, number];
};
