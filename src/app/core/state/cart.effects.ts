import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import * as CartActions from './cart.actions';
import { selectCartState } from './cart.selectors';
import { ToastService } from '../services/toast.service';

@Injectable()
export class CartEffects {
  private readonly CART_KEY = 'ecommerce_cart_ngrx';

  // Persist State to LocalStorage on modifications
  saveCartToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addToCart,
          CartActions.removeFromCart,
          CartActions.updateQuantity,
          CartActions.clearCart
        ),
        withLatestFrom(this.store.select(selectCartState)),
        tap(([action, cartState]) => {
          localStorage.setItem(this.CART_KEY, JSON.stringify(cartState));
        })
      ),
    { dispatch: false }
  );

  // Show Toast on Add
  showToastOnAdd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.addToCart),
        tap(({ product, quantity }) => {
          this.toastService.success(`Added ${quantity}x ${product.title} to Cart`);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private toastService: ToastService
  ) {}
}
