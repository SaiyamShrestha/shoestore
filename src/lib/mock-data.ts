import type { Product, ProductReview } from './types';

const sampleReviews: ProductReview[] = [
  { id: 'review1', author: 'Alex K.', rating: 5, comment: 'Amazingly comfortable and stylish!', date: '2024-05-01' },
  { id: 'review2', author: 'Jamie L.', rating: 4, comment: 'Great shoes, but a bit pricey.', date: '2024-05-05' },
  { id: 'review3', author: 'Casey P.', rating: 5, comment: 'Perfect fit and excellent quality.', date: '2024-04-20' },
];

// Allow products to be mutated for in-memory CRUD operations
export let products: Product[] = [
  {
    id: '1',
    name: 'Urban Strider X1',
    brand: 'NovaGear',
    description: 'Experience ultimate comfort and style with the Urban Strider X1. Perfect for city walks and casual outings. Features breathable mesh and responsive cushioning.',
    price: 120.00,
    images: ['https://placehold.co/800x600.png?a=1', 'https://placehold.co/800x600.png?a=2', 'https://placehold.co/800x600.png?a=3'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    availableColors: ['Black', 'White', 'Navy Blue'],
    category: 'Sneakers',
    reviews: sampleReviews.slice(0,2),
    slug: 'urban-strider-x1',
    stock: 50,
    tags: ['casual', 'running', 'comfort'],
    dataAiHint: 'sneaker shoe',
  },
  {
    id: '2',
    name: 'TrailBlazer Pro Boots',
    brand: 'TerraBoot',
    description: 'Conquer any terrain with the TrailBlazer Pro Boots. Waterproof, durable, and designed for the adventurous spirit. Provides excellent ankle support and grip.',
    price: 180.00,
    images: ['https://placehold.co/800x600.png?b=1', 'https://placehold.co/800x600.png?b=2'],
    sizes: ['8', '9', '10', '11', '12', '13'],
    availableColors: ['Brown', 'Dark Olive'],
    category: 'Boots',
    reviews: [sampleReviews[2]],
    slug: 'trailblazer-pro-boots',
    stock: 30,
    tags: ['hiking', 'outdoor', 'waterproof'],
    dataAiHint: 'hiking boot',
  },
  {
    id: '3',
    name: 'Elegant Loafer Classic',
    brand: 'Gentlemen\'s Choice',
    description: 'Step out in sophistication with the Elegant Loafer Classic. Crafted from premium leather, these loafers are perfect for formal events and office wear.',
    price: 150.00,
    images: ['https://placehold.co/800x600.png?c=1'],
    sizes: ['7', '8', '9', '10', '10.5', '11'],
    availableColors: ['Mahogany', 'Black'],
    category: 'Formal Shoes',
    reviews: [],
    slug: 'elegant-loafer-classic',
    stock: 25,
    tags: ['formal', 'office', 'leather'],
    dataAiHint: 'loafer shoe',
  },
  {
    id: '4',
    name: 'Summer Breeze Sandals',
    brand: 'SunStep',
    description: 'Enjoy the summer with these light and airy Summer Breeze Sandals. Designed for maximum comfort and breathability on hot days.',
    price: 60.00,
    images: ['https://placehold.co/800x600.png?d=1', 'https://placehold.co/800x600.png?d=2'],
    sizes: ['6', '7', '8', '9', '10'],
    availableColors: ['Beige', 'Light Blue', 'Coral'],
    category: 'Sandals',
    reviews: sampleReviews.slice(1,3),
    slug: 'summer-breeze-sandals',
    stock: 70,
    tags: ['summer', 'beach', 'casual'],
    dataAiHint: 'sandal shoe',
  },
  {
    id: '5',
    name: 'Performance Runner Z500',
    brand: 'NovaGear',
    description: 'Achieve your personal best with the Performance Runner Z500. Lightweight design, superior energy return, and engineered for speed.',
    price: 135.00,
    images: ['https://placehold.co/800x600.png?e=1', 'https://placehold.co/800x600.png?e=2', 'https://placehold.co/800x600.png?e=3'],
    sizes: ['7.5', '8', '8.5', '9', '9.5', '10', '11'],
    availableColors: ['Electric Blue', 'Volt Green', 'Stealth Gray'],
    category: 'Running Shoes',
    reviews: [sampleReviews[0]],
    slug: 'performance-runner-z500',
    stock: 40,
    tags: ['running', 'performance', 'sport'],
    dataAiHint: 'running shoe',
  },
  {
    id: '6',
    name: 'Classic Oxford Brogue',
    brand: 'Gentlemen\'s Choice',
    description: 'Timeless elegance meets modern craftsmanship. The Classic Oxford Brogue is a staple for any discerning wardrobe, perfect for weddings and business meetings.',
    price: 190.00,
    images: ['https://placehold.co/800x600.png?f=1', 'https://placehold.co/800x600.png?f=2'],
    sizes: ['8', '9', '10', '11', '12'],
    availableColors: ['Tan', 'Dark Brown', 'Black'],
    category: 'Formal Shoes',
    reviews: [],
    slug: 'classic-oxford-brogue',
    stock: 15,
    tags: ['formal', 'business', 'leather', 'wedding'],
    dataAiHint: 'oxford shoe',
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getAllProducts = (): Product[] => {
  return products;
};

export const getFilterOptions = (): { sizes: string[], colors: string[], brands: string[], categories: string[], maxPrice: number } => {
  const sizes = new Set<string>();
  const colors = new Set<string>();
  const brands = new Set<string>();
  const categories = new Set<string>();
  let maxPrice = 0;

  products.forEach(product => {
    product.sizes.forEach(size => sizes.add(size));
    product.availableColors.forEach(color => colors.add(color));
    brands.add(product.brand);
    categories.add(product.category);
    if (product.price > maxPrice) {
      maxPrice = product.price;
    }
  });

  return {
    sizes: Array.from(sizes).sort(),
    colors: Array.from(colors).sort(),
    brands: Array.from(brands).sort(),
    categories: Array.from(categories).sort(),
    maxPrice: Math.ceil(maxPrice / 100) * 100, // round up to nearest 100
  };
};
