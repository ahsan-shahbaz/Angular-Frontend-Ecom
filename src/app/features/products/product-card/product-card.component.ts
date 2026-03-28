import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { Store } from '@ngrx/store';
import { addToCart } from '../../../core/state/cart.actions';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card"
         [class.out-of-stock]="product.stock === 0"
         (click)="goToDetails()"
         (keydown.enter)="goToDetails()"
         tabindex="0"
         role="button"
         [attr.aria-label]="'View details for ' + product.title">

      <!-- Image Container -->
      <div class="image-container">
        <img [src]="product.image" [alt]="product.title" loading="lazy">

        <!-- Badges -->
        <div class="badges">
          <span class="badge sale" *ngIf="product.discountPercentage">-{{ product.discountPercentage }}%</span>
          <span class="badge new" *ngIf="isNewProduct()">NEW</span>
          <span class="badge featured" *ngIf="product.rating.rate >= 4.5">⭐ {{ product.rating.rate }}</span>
        </div>

        <!-- Wishlist Button -->
        <button class="wishlist-btn"
                [class.active]="wishlistService.isInWishlist(product.id)"
                (click)="toggleWishlist($event)"
                [attr.aria-label]="wishlistService.isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"
               [class.filled]="wishlistService.isInWishlist(product.id)">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <!-- Quick Add Button -->
        <button class="quick-add"
                *ngIf="product.stock > 0"
                (click)="onAddToCart($event)"
                [attr.aria-label]="'Add ' + product.title + ' to cart'">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Add to Cart</span>
        </button>

        <!-- Out of Stock Overlay -->
        <div class="out-of-stock-overlay" *ngIf="product.stock === 0">
          <span>Out of Stock</span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <!-- Category -->
        <span class="category">{{ product.category }}</span>

        <!-- Title -->
        <h3 class="title">{{ product.title }}</h3>

        <!-- Rating -->
        <div class="rating" *ngIf="product.rating">
          <div class="stars">
            <div class="stars-bg"><span>★★★★★</span></div>
            <div class="stars-fill" [style.width.%]="(product.rating.rate / 5) * 100">
              <span>★★★★★</span>
            </div>
          </div>
          <span class="review-count">({{ product.rating.count }})</span>
        </div>

        <!-- Price Row -->
        <div class="price-row">
          <div class="prices">
            <span class="current-price">{{ product.price | currency }}</span>
            <span class="original-price" *ngIf="product.originalPrice">{{ product.originalPrice | currency }}</span>
          </div>

          <span class="stock-status" [class.in-stock]="product.stock > 0"
                                  [class.low-stock]="product.stock > 0 && product.stock <= 5"
                                  [class.out-stock]="product.stock === 0">
            {{ getStockText() }}
          </span>
        </div>

        <!-- Tags -->
        <div class="tags" *ngIf="product.tags?.length">
          <span class="tag" *ngFor="let tag of product.tags.slice(0, 3)">{{ tag }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border-radius: var(--radius-2xl);
      border: 1px solid var(--border-color);
      overflow: hidden;
      cursor: pointer;
      transition: all var(--duration-slow) var(--ease-spring);
      position: relative;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-2xl);
      border-color: var(--primary-200);
    }

    .product-card:hover .image-container img {
      transform: scale(1.08);
    }

    .product-card:hover .quick-add {
      opacity: 1;
      transform: translateY(0);
    }

    .product-card:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }

    .product-card.out-of-stock .image-container img {
      opacity: 0.5;
    }

    /* IMAGE CONTAINER */
    .image-container {
      position: relative;
      aspect-ratio: 1 / 1;
      background: var(--img-bg);
      overflow: hidden;
    }

    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: var(--space-6);
      transition: transform var(--duration-slow) var(--ease-spring);
    }

    /* BADGES */
    .badges {
      position: absolute;
      top: var(--space-4);
      left: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      z-index: 2;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }

    .badge.sale {
      background: var(--gradient-accent);
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .badge.new {
      background: var(--teal-500);
      color: white;
    }

    .badge.featured {
      background: var(--surface-900);
      color: white;
    }

    /* WISHLIST BUTTON */
    .wishlist-btn {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-full);
      color: var(--text-muted);
      cursor: pointer;
      opacity: 0;
      transform: translateY(-10px);
      transition: all var(--duration-base) var(--ease-spring);
      z-index: 2;
    }

    .wishlist-btn svg {
      fill: transparent;
      transition: fill var(--duration-fast) var(--ease-out);
    }

    .wishlist-btn svg.filled {
      fill: var(--coral-500);
      color: var(--coral-500);
    }

    .wishlist-btn.active {
      opacity: 1;
      transform: translateY(0);
    }

    .wishlist-btn.active svg {
      fill: var(--coral-500);
      color: var(--coral-500);
    }

    .product-card:hover .wishlist-btn {
      opacity: 1;
      transform: translateY(0);
    }

    .wishlist-btn:hover {
      background: var(--coral-100);
      color: var(--coral-500);
      border-color: var(--coral-200);
    }

    .wishlist-btn.active:hover {
      background: var(--coral-100);
    }

    /* QUICK ADD BUTTON */
    .quick-add {
      position: absolute;
      bottom: var(--space-4);
      left: var(--space-4);
      right: var(--space-4);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3);
      background: var(--gradient-primary);
      color: white;
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      opacity: 0;
      transform: translateY(20px);
      transition: all var(--duration-base) var(--ease-spring);
      box-shadow: var(--button-primary-shadow);
      z-index: 2;
    }

    .quick-add:hover {
      background: var(--gradient-primary-hover);
      box-shadow: var(--button-primary-shadow-hover);
      transform: translateY(-2px);
    }

    .quick-add:active {
      transform: translateY(0);
    }

    /* OUT OF STOCK OVERLAY */
    .out-of-stock-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 3;
    }

    .out-of-stock-overlay span {
      background: var(--error-500);
      color: white;
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-lg);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wider);
    }

    /* PRODUCT INFO */
    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      padding: var(--space-5);
    }

    .category {
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      text-transform: uppercase;
      letter-spacing: var(--tracking-widest);
      color: var(--primary-500);
    }

    .title {
      margin: 0;
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--text-main);
      line-height: var(--leading-snug);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.5em;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .product-card:hover .title {
      color: var(--primary-600);
    }

    /* RATING */
    .rating {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-top: auto;
    }

    .stars {
      position: relative;
      font-size: var(--text-sm);
      line-height: 1;
    }

    .stars-bg {
      color: var(--surface-300);
    }

    .stars-fill {
      position: absolute;
      top: 0;
      left: 0;
      color: #fbbf24;
      overflow: hidden;
      white-space: nowrap;
    }

    .review-count {
      font-size: var(--text-xs);
      color: var(--text-muted);
    }

    /* PRICE ROW */
    .price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      padding-top: var(--space-3);
      border-top: 1px solid var(--border-color);
    }

    .prices {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
    }

    .current-price {
      font-size: var(--text-lg);
      font-weight: var(--font-bold);
      color: var(--text-main);
    }

    .original-price {
      font-size: var(--text-sm);
      color: var(--text-muted);
      text-decoration: line-through;
    }

    .stock-status {
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wide);
    }

    .stock-status.in-stock {
      color: var(--success-500);
    }

    .stock-status.low-stock {
      color: var(--warning-500);
    }

    .stock-status.out-stock {
      color: var(--error-500);
    }

    /* TAGS */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
      margin-top: var(--space-1);
    }

    .tag {
      padding: var(--space-1) var(--space-2);
      background: var(--surface-100);
      color: var(--text-muted);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      border-radius: var(--radius-md);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private store = inject(Store);
  private router = inject(Router);
  wishlistService = inject(WishlistService);

  onAddToCart(event: Event) {
    event.stopPropagation();
    if (this.product.stock > 0) {
      this.store.dispatch(addToCart({ product: this.product, quantity: 1 }));
    }
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product);
  }

  goToDetails() {
    this.router.navigate(['/products', this.product.id]);
  }

  isNewProduct(): boolean {
    return this.product.id % 2 === 0;
  }

  getStockText(): string {
    if (this.product.stock === 0) return 'Out of Stock';
    if (this.product.stock <= 5) return `Only ${this.product.stock} left`;
    return 'In Stock';
  }
}
