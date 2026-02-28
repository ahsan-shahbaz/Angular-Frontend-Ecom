import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}
