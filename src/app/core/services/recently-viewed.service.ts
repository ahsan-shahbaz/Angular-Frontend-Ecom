import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private readonly RECENTLY_VIEWED_KEY = 'ecommerce_recent_views';
  private readonly MAX_HISTORY = 5;

  private recentSignal = signal<Product[]>(this.loadFromStorage());
  public items = this.recentSignal.asReadonly();

  constructor() {}

  private loadFromStorage(): Product[] {
    try {
      const stored = localStorage.getItem(this.RECENTLY_VIEWED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: Product[]) {
    localStorage.setItem(this.RECENTLY_VIEWED_KEY, JSON.stringify(items));
  }

  addViewedProduct(product: Product) {
    const current = this.recentSignal();
    // Remove if already exists so we can move it to the front
    const filtered = current.filter(p => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, this.MAX_HISTORY);
    
    this.recentSignal.set(updated);
    this.saveToStorage(updated);
  }
}
