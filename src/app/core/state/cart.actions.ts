import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model';

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCartState = createAction(
  '[Cart] Load State',
  props<{ items: any[]; totalQuantity: number; totalPrice: number }>()
);
