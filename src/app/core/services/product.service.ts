import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, shareReplay, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

const MOCK_PRODUCTS: Product[] = [
  // ... mock data remains identical
  {
    id: 1,
    title: 'Apple MacBook Pro M3 Max 16-inch',
    price: 3499.00,
    originalPrice: 3999.00,
    discountPercentage: 12.5,
    description: 'The most advanced Mac for pros. Features the groundbreaking M3 Max chip with 16-core CPU, 40-core GPU, and up to 128GB unified memory.',
    brand: 'Apple',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['M3 Max Chip', 'Liquid Retina XDR Display', 'Up to 22 hours battery life', '1080p FaceTime HD camera'],
    stock: 12,
    rating: { rate: 4.9, count: 120 },
    tags: ['laptop', 'pro', 'apple']
  },
  {
    id: 2,
    title: 'Sony Alpha a7 IV Full-Frame Mirrorless',
    price: 2498.00,
    description: 'Next-generation full-frame mirrorless interchangeable lens camera with 33MP sensor and 4K 60p video capabilities.',
    brand: 'Sony',
    category: 'photography',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['33MP Full-Frame Exmor R CMOS Sensor', 'Up to 10 fps Shooting', 'Real-time Eye AF for Humans/Animals', '4K 60p Video Recording'],
    stock: 8,
    rating: { rate: 4.8, count: 245 },
    tags: ['camera', 'mirrorless', 'sony']
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: 348.00,
    originalPrice: 399.00,
    discountPercentage: 12.7,
    description: 'Industry-leading noise canceling headphones with Auto Noise Canceling Optimizer, crystal clear hands-free calling, and Alexa voice control.',
    brand: 'Sony',
    category: 'audio',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Industry Leading Noise Cancellation', '30-Hour Battery Life', 'Multipoint Connection', 'Touch Sensor Controls'],
    stock: 45,
    rating: { rate: 4.7, count: 1890 },
    tags: ['headphones', 'wireless', 'audio', 'noise-canceling']
  },
  {
    id: 4,
    title: 'Samsung 49-Inch Odyssey G9 Gaming Monitor',
    price: 1199.99,
    originalPrice: 1499.99,
    discountPercentage: 20,
    description: 'Unmatched gaming performance with 240Hz refresh rate, 1ms response time, and extremely curved 1000R panel for ultimate immersion.',
    brand: 'Samsung',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['49-inch Super Ultrawide', '1000R Curvature', '240Hz Refresh Rate', 'QLED Technology'],
    stock: 5,
    rating: { rate: 4.6, count: 532 },
    tags: ['monitor', 'gaming', 'ultrawide', 'samsung']
  },
  {
    id: 5,
    title: 'Minimalist Leather Oxford Shoes',
    price: 185.00,
    description: 'Crafted from premium full-grain Italian leather. Features a timeless minimalist design with a durable rubber sole for all-day comfort.',
    brand: 'Everlane',
    category: 'men clothing',
    image: 'https://images.unsplash.com/photo-1614252339474-ce3a480a4f3e?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1614252339474-ce3a480a4f3e?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Full-grain leather', 'Hand-stitched detailing', 'Breathable leather lining', 'Anti-slip sole'],
    stock: 24,
    rating: { rate: 4.5, count: 89 },
    tags: ['shoes', 'leather', 'fashion', 'men']
  },
  {
    id: 6,
    title: 'Nike Air Zoom Pegasus 40',
    price: 130.00,
    description: 'A springy ride for every run. The Peg 40 brings back the tailored fit and feel you love, right down to the responsive React foam.',
    brand: 'Nike',
    category: 'men clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Nike React foam', 'Zoom Air units', 'Engineered mesh upper', 'Waffle-inspired rubber outsole'],
    stock: 120,
    rating: { rate: 4.8, count: 420 },
    tags: ['shoes', 'running', 'sport', 'nike']
  },
  {
    id: 7,
    title: 'Keychron Q1 Pro Mechanical Keyboard',
    price: 199.00,
    description: 'A fully customizable 75% layout wireless custom mechanical keyboard with QMK/VIA support, designed with a premium aluminum CNC machined body.',
    brand: 'Keychron',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Wireless / Wired', 'Hot-Swappable', 'QMK/VIA support', 'CNC Aluminum Body', 'Double-gasket design'],
    stock: 30,
    rating: { rate: 4.9, count: 215 },
    tags: ['keyboard', 'mechanical', 'wireless', 'accessories']
  },
  {
    id: 8,
    title: 'Bose SoundLink Revolve+ II',
    price: 329.00,
    description: 'Deep, loud, and immersive sound, with True 360° coverage. Built-in handle, water-resistant, up to 17 hours of battery life.',
    brand: 'Bose',
    category: 'audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['True 360° Sound', 'Water and dust-resistant', 'Up to 17 hours per charge', 'Built-in microphone'],
    stock: 50,
    rating: { rate: 4.7, count: 681 },
    tags: ['speaker', 'audio', 'bluetooth', 'bose']
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // RxJS ShareReplay Cache
  private productsCache$?: Observable<Product[]>;
  private categoriesCache$?: Observable<string[]>;

  getProducts(): Observable<Product[]> {
    if (!this.productsCache$) {
      this.productsCache$ = of(MOCK_PRODUCTS).pipe(
        delay(500),
        catchError(err => throwError(() => new Error('Error fetching products'))),
        shareReplay(1)
      );
    }
    return this.productsCache$;
  }

  getProduct(id: number): Observable<Product | undefined> {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return of(product).pipe(delay(200)); // lighter delay for single fetch
  }

  getCategories(): Observable<string[]> {
    if (!this.categoriesCache$) {
      const categories = ['electronics', 'photography', 'audio', 'men clothing'];
      this.categoriesCache$ = of(categories).pipe(
        delay(300),
        shareReplay(1)
      );
    }
    return this.categoriesCache$;
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts().pipe(
      delay(200)
    );
  }
}

