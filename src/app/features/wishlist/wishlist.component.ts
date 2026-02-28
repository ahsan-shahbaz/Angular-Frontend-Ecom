import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, ButtonComponent],
  template: `
    <div class="wishlist-page">
      <div class="page-header">
         <h2>Your Wishlist</h2>
         <p class="subtitle" *ngIf="wishlistService.wishlistCount() > 0">
           You have {{ wishlistService.wishlistCount() }} items saved for later.
         </p>
      </div>

      <ng-container *ngIf="wishlistService.wishlistCount() > 0; else emptyState">
        <div class="products-grid">
           <app-product-card 
             *ngFor="let product of wishlistService.items()" 
             [product]="product">
           </app-product-card>
        </div>
      </ng-container>

      <ng-template #emptyState>
        <div class="empty-state">
          <div class="icon-circle">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Explore our premium collection and save your favorites.</p>
          <app-button routerLink="/products" size="lg">Discover Products</app-button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .wishlist-page {
      max-width: 1200px;
      margin: 0 auto;
      padding-bottom: 4rem;
    }
    .page-header {
      margin-bottom: 3rem;
      text-align: center;
    }
    .page-header h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-color, #111827);
      margin: 0 0 0.5rem 0;
    }
    .subtitle {
      color: var(--text-color-muted, #4b5563);
      font-size: 1.125rem;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 5rem 1rem;
      background: var(--card-bg, #f9fafb);
      border-radius: 24px;
      border: 1px dashed var(--border-color, #d1d5db);
    }
    .icon-circle {
      width: 80px;
      height: 80px;
      background: #fee2e2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color, #111827);
      margin: 0 0 0.5rem 0;
    }
    .empty-state p {
      color: var(--text-color-muted, #4b5563);
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }

    :host-context(.dark-theme) {
      --text-color: #f9fafb;
      --text-color-muted: #9ca3af;
      --card-bg: #1f2937;
      --border-color: #374151;
    }
    :host-context(.dark-theme) .icon-circle {
      background: rgba(239, 68, 68, 0.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistComponent {
  public wishlistService = inject(WishlistService);
}
