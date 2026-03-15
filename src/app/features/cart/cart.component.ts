import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../core/services/cart.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="cart-page">
      <h2>Shopping Cart</h2>

      <ng-container *ngIf="vm() as vm">
        <div class="cart-layout" *ngIf="vm.items.length > 0; else emptyCart">
          
          <div class="cart-items">
             <div class="cart-item" *ngFor="let item of vm.items; trackBy: trackByProductId">
                <div class="item-img"><img [src]="item.product.image" [alt]="item.product.title"></div>
                
                <div class="item-details">
                  <h4 [routerLink]="['/products', item.product.id]" class="item-title">{{ item.product.title }}</h4>
                  <p class="item-variant" *ngIf="item.selectedVariant">Variant: <span>{{ item.selectedVariant }}</span></p>
                  <p class="item-price">\${{ item.product.price | number:'1.2-2' }}</p>
                </div>

                <div class="item-actions">
                  <div class="quantity-control">
                    <button class="qty-btn" (click)="updateQty(item.product.id, item.selectedVariant, item.quantity - 1)">-</button>
                    <span class="qty">{{ item.quantity }}</span>
                    <button class="qty-btn" (click)="updateQty(item.product.id, item.selectedVariant, item.quantity + 1)">+</button>
                  </div>
                  <button class="remove-btn" (click)="removeItem(item.product.id, item.selectedVariant)">🗑️ Remove</button>
                </div>
             </div>
          </div>

          <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-line">
              <span>Items ({{ vm.totalQuantity }}):</span>
              <span>\${{ vm.totalPrice | number:'1.2-2' }}</span>
            </div>
            <div class="summary-line total">
              <strong>Total:</strong>
              <strong>\${{ vm.totalPrice | number:'1.2-2' }}</strong>
            </div>
            
            <app-button size="lg" class="checkout-btn" routerLink="/checkout">
              Proceed to Checkout
            </app-button>
          </div>
        </div>
      </ng-container>

      <ng-template #emptyCart>
        <div class="empty-state">
          <p>Your cart is empty.</p>
          <app-button variant="primary" routerLink="/products">Continue Shopping</app-button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-page { max-width: 1000px; margin: 0 auto; }
    h2 { margin-bottom: 2rem; color: var(--text-color, #1f2937); }
    
    .cart-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      background: var(--card-bg, white);
    }
    .item-img {
      width: 80px;
      height: 80px;
      background: white;
      padding: 0.5rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .item-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .item-details { flex: 1; }
    .item-title { cursor: pointer; margin: 0 0 0.5rem 0; color: var(--text-color, #1f2937); }
    .item-variant { font-size: 0.85rem; color: #6366f1; font-weight: 600; margin-bottom: 0.5rem; }
    .item-variant span { color: var(--text-color, #4b5563); font-weight: 400; }
    .item-price { font-weight: bold; margin: 0; color: var(--text-color, #374151); }
    
    .item-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1rem;
    }
    .quantity-control {
      display: flex;
      align-items: center;
      border: 1px solid var(--border-color, #d1d5db);
      border-radius: 4px;
    }
    .qty-btn {
      background: none;
      border: none;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      color: var(--text-color, #374151);
    }
    .qty { padding: 0 0.75rem; font-weight: 500; color: var(--text-color, #1f2937); }
    .remove-btn { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.875rem; }

    .cart-summary {
      background: var(--card-bg, #f9fafb);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--border-color, #e5e7eb);
      height: fit-content;
      position: sticky;
      top: 100px;
    }
    .cart-summary h3 { margin-bottom: 1.5rem; color: var(--text-color, #1f2937); }
    .summary-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      color: var(--text-color, #4b5563);
    }
    .total {
      font-size: 1.25rem;
      border-top: 1px solid var(--border-color, #e5e7eb);
      padding-top: 1rem;
      color: var(--text-color, #1f2937);
    }
    .checkout-btn { width: 100%; margin-top: 1.5rem; }

    .empty-state { text-align: center; padding: 4rem; color: #6b7280; font-size: 1.25rem; }

    :host-context(.dark-theme) {
      --text-color: #f9fafb;
      --card-bg: #1f2937;
      --border-color: #374151;
    }

    @media (max-width: 768px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-item { flex-direction: column; text-align: center; }
      .item-actions { align-items: center; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  private cartService = inject(CartService);

  vm = toSignal(this.cartService.cartState$, { initialValue: { items: [], totalQuantity: 0, totalPrice: 0 } });


  updateQty(productId: number, variant: string | undefined, qty: number) {
    this.cartService.updateQuantity(productId, qty, variant);
  }

  removeItem(productId: number, variant: string | undefined) {
    this.cartService.removeFromCart(productId, variant);
  }

  trackByProductId(index: number, item: any): string {
    return `${item.product.id}-${item.selectedVariant || ''}`;
  }
}
