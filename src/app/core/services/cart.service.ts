import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../models/product.model';
import { CartItem, CartState } from '../models/cart.model';
import * as CartActions from '../state/cart.actions';
import { selectCartState, selectTotalPrice, selectTotalQuantity, selectCartItems } from '../state/cart.selectors';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'ecommerce_cart_ngrx';
  private store = inject(Store);

  // Expose observables from store
  cartState$ = this.store.select(selectCartState);
  cartItems$ = this.store.select(selectCartItems);
  totalQuantity$ = this.store.select(selectTotalQuantity);
  totalPrice$ = this.store.select(selectTotalPrice);

  constructor() {
    this.hydrateStateLocally();
  }

  private hydrateStateLocally() {
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

  addToCart(product: Product, quantity: number = 1) {
    this.store.dispatch(CartActions.addToCart({ product, quantity }));
  }

  removeFromCart(productId: number) {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  clearCart() {
    this.store.dispatch(CartActions.clearCart());
  }
}
