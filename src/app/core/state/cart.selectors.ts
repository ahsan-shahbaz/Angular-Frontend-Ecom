import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CartState } from '../models/cart.model';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

export const selectTotalQuantity = createSelector(
  selectCartState,
  (state: CartState) => state.totalQuantity
);

export const selectTotalPrice = createSelector(
  selectCartState,
  (state: CartState) => state.totalPrice
);
