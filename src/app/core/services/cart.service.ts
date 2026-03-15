import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Product } from '../models/product.model';
import { CartItem, CartState } from '../models/cart.model';
import * as CartActions from '../state/cart.actions';
import { selectCartState, selectTotalPrice, selectTotalQuantity, selectCartItems } from '../state/cart.selectors';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'ecommerce_cart_ngrx';
  private store = inject(Store);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  // Expose observables from store
  cartState$ = this.store.select(selectCartState);
  cartItems$ = this.store.select(selectCartItems);
  totalQuantity$ = this.store.select(selectTotalQuantity);
  totalPrice$ = this.store.select(selectTotalPrice);

  constructor() {
    this.hydrateStateLocally();
  }

  private hydrateStateLocally() {
    // Keep local hydration as backup or for offline
    const savedCart = localStorage.getItem(this.CART_KEY);
    if (savedCart) {
      try {
        const parsed: CartState = JSON.parse(savedCart);
        this.store.dispatch(CartActions.loadCartState({ 
          items: parsed.items, 
          totalQuantity: parsed.totalQuantity, 
          totalPrice: parsed.totalPrice 
        }));
      } catch (e) {
        console.error('Failed to parse cart from local storage', e);
      }
    }
  }

  // Backend sync methods
  getCartFromServer(): Observable<CartState> {
    return this.http.get<CartState>(this.apiUrl);
  }

  addToCart(product: Product, quantity: number = 1, variant?: string) {
    // First update local state for responsiveness
    this.store.dispatch(CartActions.addToCart({ product, quantity, variant }));
    
    // Sync with backend - Effects will handle this or we can do it here
    this.http.post<CartState>(this.apiUrl, { productId: product.id, quantity, variant }).subscribe(
      cart => this.store.dispatch(CartActions.loadCartState(cart)),
      error => console.error('Error adding to cart on server:', error)
    );
  }

  removeFromCart(productId: number, variant?: string) {
    this.store.dispatch(CartActions.removeFromCart({ productId, variant }));
    
    const url = variant 
      ? `${this.apiUrl}/${productId}?variant=${encodeURIComponent(variant)}`
      : `${this.apiUrl}/${productId}`;
      
    this.http.delete<CartState>(url).subscribe(
      cart => this.store.dispatch(CartActions.loadCartState(cart)),
      error => console.error('Error removing from cart on server:', error)
    );
  }

  updateQuantity(productId: number, quantity: number, variant?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, variant);
      return;
    }
    
    this.store.dispatch(CartActions.updateQuantity({ productId, variant, quantity }));
    
    const url = variant 
      ? `${this.apiUrl}/${productId}?quantity=${quantity}&variant=${encodeURIComponent(variant)}`
      : `${this.apiUrl}/${productId}?quantity=${quantity}`;
      
    this.http.put<CartState>(url, {}).subscribe(
      cart => this.store.dispatch(CartActions.loadCartState(cart)),
      error => console.error('Error updating cart on server:', error)
    );
  }

  clearCart() {
    this.store.dispatch(CartActions.clearCart());
    this.http.delete<CartState>(this.apiUrl).subscribe(
      cart => this.store.dispatch(CartActions.loadCartState(cart)),
      error => console.error('Error clearing cart on server:', error)
    );
  }
}
