import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly WISHLIST_KEY = 'ecommerce_wishlist';
  
  // Using Angular 16 Signals for robust synchronous reactivity
  private wishlistSignal = signal<Product[]>(this.loadFromStorage());

  // Computed signal to just get the count easily
  public wishlistCount = computed(() => this.wishlistSignal().length);
  public items = this.wishlistSignal.asReadonly();

  constructor() {}

  private loadFromStorage(): Product[] {
    try {
      const stored = localStorage.getItem(this.WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: Product[]) {
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(items));
  }

  toggleWishlist(product: Product) {
    const current = this.wishlistSignal();
    const exists = current.find(p => p.id === product.id);
    
    let updated: Product[];
    if (exists) {
      updated = current.filter(p => p.id !== product.id);
    } else {
      updated = [...current, product];
    }
    
    this.wishlistSignal.set(updated);
    this.saveToStorage(updated);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistSignal().some(p => p.id === productId);
  }
}
