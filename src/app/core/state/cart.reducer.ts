import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartState, CartItem } from '../models/cart.model';

export const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0
};

function calculateTotals(items: CartItem[]) {
  return {
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  };
}

export const cartReducer = createReducer(
  initialState,
  on(CartActions.loadCartState, (state, { items, totalQuantity, totalPrice }) => ({
    ...state,
    items,
    totalQuantity,
    totalPrice
  })),
  on(CartActions.addToCart, (state, { product, quantity, variant }) => {
    const existingItem = state.items.find(item => 
      item.product.id === product.id && item.selectedVariant === variant
    );
    let updatedItems;

    if (existingItem) {
      updatedItems = state.items.map(item =>
        item.product.id === product.id && item.selectedVariant === variant
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...state.items, { product, quantity, selectedVariant: variant }];
    }

    const totals = calculateTotals(updatedItems);
    return { ...state, items: updatedItems, ...totals };
  }),
  on(CartActions.removeFromCart, (state, { productId, variant }) => {
    const updatedItems = state.items.filter(item => 
      !(item.product.id === productId && item.selectedVariant === variant)
    );
    const totals = calculateTotals(updatedItems);
    return { ...state, items: updatedItems, ...totals };
  }),
  on(CartActions.updateQuantity, (state, { productId, variant, quantity }) => {
    const updatedItems = state.items.map(item =>
      (item.product.id === productId && item.selectedVariant === variant) 
        ? { ...item, quantity } 
        : item
    );
    const totals = calculateTotals(updatedItems);
    return { ...state, items: updatedItems, ...totals };
  }),
  on(CartActions.clearCart, () => initialState)
);
