import { Component, ChangeDetectionStrategy, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { RecentlyViewedService } from '../../../core/services/recently-viewed.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/models/product.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { LoadingSkeletonComponent } from '../../../shared/ui/loading-skeleton/loading-skeleton.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoadingSkeletonComponent, ProductCardComponent],
  template: `
    <div class="details-wrapper" *ngIf="product$ | async as product; else loading">
      
      <!-- Breadcrumbs -->
      <nav class="breadcrumb">
        <a (click)="goBack()">Products</a>
        <span class="separator">/</span>
        <span class="current">{{ product.category }}</span>
        <span class="separator">/</span>
        <span class="current">{{ product.brand }}</span>
      </nav>

      <div class="details-page">
        <!-- Image Section -->
        <div class="image-section">
          <div class="main-image">
             <span class="discount-badge" *ngIf="product.discountPercentage">-{{ product.discountPercentage }}%</span>
             <img [src]="activeImage$ | async" [alt]="product.title">
          </div>
          <div class="thumbnail-gallery" *ngIf="product.images.length > 1">
             <div class="thumbnail" 
                  *ngFor="let img of product.images" 
                  [class.active]="(activeImage$ | async) === img"
                  (click)="setActiveImage(img)">
                <img [src]="img" alt="Thumbnail">
             </div>
          </div>
        </div>
        
        <!-- Info Section -->
        <div class="product-info">
          <div class="header-info">
            <h2 class="brand">{{ product.brand }}</h2>
            <h1 class="title">{{ product.title }}</h1>
            
            <div class="rating-stock">
               <div class="rating">
                 <span class="stars">★★★★★</span>
                 <span class="score">{{ product.rating.rate }}</span>
                 <span class="count">({{ product.rating.count }} reviews)</span>
               </div>
               <div class="stock-status" [ngClass]="product.stock > 0 ? 'in-stock' : 'out-of-stock'">
                 <span class="dot"></span>
                 {{ product.stock > 0 ? 'In Stock (' + product.stock + ')' : 'Out of Stock' }}
               </div>

               <button class="wishlist-toggle-btn" 
                       [class.active]="wishlistService.isInWishlist(product.id)" 
                       (click)="wishlistService.toggleWishlist(product)"
                       title="Toggle Wishlist">
                  <i class="pi" [ngClass]="wishlistService.isInWishlist(product.id) ? 'pi-heart-fill' : 'pi-heart'"></i>
                  {{ wishlistService.isInWishlist(product.id) ? 'Saved' : 'Save' }}
               </button>
            </div>
          </div>

          <div class="price-section">
            <p class="price">\${{ product.price | number:'1.2-2' }}</p>
            <p class="original-price" *ngIf="product.originalPrice">\${{ product.originalPrice | number:'1.2-2' }}</p>
          </div>
          
          <div class="features-box">
             <h3>Key Features</h3>
             <ul>
               <li *ngFor="let feature of product.features">{{ feature }}</li>
             </ul>
          </div>

          <div class="actions" *ngIf="quantity$ | async as qty">
            <div class="quantity-selector" [class.disabled]="product.stock === 0">
               <button class="qty-btn" [disabled]="qty <= 1 || product.stock === 0" (click)="updateQuantity(qty - 1)">-</button>
               <span class="qty-val">{{ qty }}</span>
               <button class="qty-btn" [disabled]="qty >= product.stock || product.stock === 0" (click)="updateQuantity(qty + 1)">+</button>
            </div>
            <app-button size="lg" (onClick)="addToCart(product, qty)" class="flex-1" [disabled]="product.stock === 0">
              <span class="btn-content">🛒 Add to Cart</span>
            </app-button>
          </div>

          <div class="description-box">
            <h3>About this item</h3>
            <p [innerHTML]="sanitizedDescription"></p>
            
            <div class="tags">
               <span class="tag" *ngFor="let tag of product.tags">{{ tag }}</span>
            </div>
          </div>

          <div class="perks">
            <div class="perk"><div class="icon">🚚</div> Free Fast Delivery</div>
            <div class="perk"><div class="icon">🛡️</div> 1 Year Warranty</div>
            <div class="perk"><div class="icon">🔄</div> 30-Day Returns</div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="related-products-section" *ngIf="relatedProducts$ | async as relatedProducts">
        <h3 class="section-title">You Might Also Like</h3>
        <div class="grid-layout">
           <app-product-card *ngFor="let rel of relatedProducts" [product]="rel"></app-product-card>
        </div>
      </div>
      
    </div>

    <ng-template #loading>
       <div class="details-wrapper">
         <div class="details-page">
           <div class="image-section"><app-loading-skeleton class="large"></app-loading-skeleton></div>
           <div class="product-info">
              <app-loading-skeleton></app-loading-skeleton>
              <br>
              <app-loading-skeleton></app-loading-skeleton>
              <br>
              <app-loading-skeleton></app-loading-skeleton>
           </div>
         </div>
       </div>
    </ng-template>
  `,
  styles: [`
    .details-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }
    .breadcrumb {
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
    .breadcrumb a { cursor: pointer; color: #3b82f6; font-weight: 500; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb .current { color: var(--text-color, #374151); text-transform: capitalize; }

    .details-page {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
    
    /* Images */
    .image-section { display: flex; flex-direction: column; gap: 1rem; }
    .main-image {
      background: var(--img-bg, white);
      padding: 3rem;
      border-radius: 24px;
      border: 1px solid var(--border-color, #e5e7eb);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 500px;
    }
    .main-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .discount-badge {
      position: absolute; top: 20px; left: 20px;
      background: #ef4444; color: white; padding: 6px 12px;
      border-radius: 8px; font-weight: bold;
    }
    .thumbnail-gallery { display: flex; gap: 1rem; }
    .thumbnail {
      width: 80px; height: 80px;
      background: white;
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 0.5rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .thumbnail img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .thumbnail.active, .thumbnail:hover { border-color: #3b82f6; }

    /* Info */
    .product-info { display: flex; flex-direction: column; }
    .brand { color: #6366f1; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 0.5rem 0;}
    .title { font-size: 2.5rem; line-height: 1.2; font-weight: 800; margin: 0 0 1.5rem 0; color: var(--text-color, #111827); }
    
    .rating-stock { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
    .rating { display: flex; align-items: center; gap: 0.5rem; }
    .stars { color: #fbbf24; font-size: 1.25rem; }
    .score { font-weight: bold; color: var(--text-color, #111827); }
    .count { color: #6b7280; }
    
    .stock-status { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.875rem;}
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .in-stock { color: #10b981; }
    .in-stock .dot { background: #10b981; }
    .out-of-stock { color: #ef4444; }
    .out-of-stock .dot { background: #ef4444; }

    /* Price */
    .price-section { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-color, #e5e7eb); }
    .price { font-size: 3rem; font-weight: 800; color: var(--text-color, #111827); margin: 0; }
    .original-price { font-size: 1.5rem; color: #9ca3af; text-decoration: line-through; margin: 0; }

    /* Features */
    .features-box { margin-bottom: 2.5rem; }
    .features-box h3 { margin: 0 0 1rem 0; color: var(--text-color, #111827); font-size: 1.25rem; }
    .features-box ul { padding-left: 1.5rem; margin: 0; color: var(--text-color, #4b5563); }
    .features-box li { margin-bottom: 0.5rem; font-size: 1.125rem; }

    /* Actions */
    .actions { display: flex; gap: 1rem; margin-bottom: 3rem; align-items: stretch; }
    .quantity-selector { display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border-color, #e5e7eb); border-radius: 12px; padding: 0.5rem; width: 140px; }
    .quantity-selector.disabled { opacity: 0.5; cursor: not-allowed; }
    .qty-btn { background: var(--bg-muted, #f3f4f6); color: var(--text-color, #111827); border: none; width: 36px; height: 36px; border-radius: 8px; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .qty-btn:hover:not(:disabled) { background: #e5e7eb; }
    .qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .qty-val { font-weight: 600; font-size: 1.125rem; color: var(--text-color, #111827); width: 30px; text-align: center; }
    .flex-1 { flex: 1; display: block; }
    ::ng-deep .flex-1 button { width: 100%; height: 100%; padding: 0 1.5rem; font-size: 1.125rem; border-radius: 12px; }
    .btn-content { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: bold; }

    /* Description */
    .description-box h3 { margin: 0 0 1rem 0; color: var(--text-color, #111827); font-size: 1.25rem; }
    .description-box p { color: var(--text-color, #4b5563); line-height: 1.8; margin-bottom: 2rem; font-size: 1.125rem; }
    
    .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 3rem; }
    .tag { background: var(--bg-muted, #f3f4f6); color: var(--text-color, #4b5563); padding: 4px 12px; border-radius: 100px; font-size: 0.875rem; font-weight: 500; text-transform: lowercase; }

    /* Perks */
    .perks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1.5rem; background: var(--bg-muted, #f9fafb); border-radius: 16px; }
    .perk { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 600; color: var(--text-color, #374151); }
    .icon { font-size: 1.5rem; }

    /* Related Products */
    .related-products-section { margin-top: 5rem; padding-top: 3rem; border-top: 1px solid var(--border-color, #e5e7eb); }
    .section-title { font-size: 2rem; font-weight: 800; margin-bottom: 2rem; color: var(--text-color, #111827); }
    .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }

    /* Wishlist Toggle Btn */
    .wishlist-toggle-btn { background: none; border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 6px 12px; cursor: pointer; color: var(--text-color, #4b5563); font-weight: 600; display: flex; align-items: center; gap: 6px; transition: all 0.2s; margin-left: auto; }
    .wishlist-toggle-btn.active { color: #ef4444; border-color: #fca5a5; background: #fee2e2; }
    .wishlist-toggle-btn:hover { background: var(--bg-muted, #f3f4f6); }

    .large { height: 500px; width: 100%; border-radius: 24px; }

    :host-context(.dark-theme) {
      --text-color: #f9fafb;
      --border-color: #374151;
      --bg-muted: #1f2937;
      --img-bg: #374151;
    }
    :host-context(.dark-theme) .main-image img, :host-context(.dark-theme) .thumbnail img {
      background: white; border-radius: 8px; padding: 10px; mix-blend-mode: normal;
    }

    @media (max-width: 900px) {
      .details-page { grid-template-columns: 1fr; gap: 2rem; }
      .perks { grid-template-columns: 1fr; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
  @Input() id!: string; 
  
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  public wishlistService = inject(WishlistService);
  private recentService = inject(RecentlyViewedService);
  private router = inject(Router);

  product$!: Observable<Product>;
  relatedProducts$!: Observable<Product[]>;
  
  private activeImageSubject = new BehaviorSubject<string>('');
  activeImage$ = this.activeImageSubject.asObservable();

  private quantitySubject = new BehaviorSubject<number>(1);
  quantity$ = this.quantitySubject.asObservable();

  sanitizedDescription: SafeHtml = '';
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.product$ = this.productService.getProduct(Number(this.id)).pipe(
      tap(p => {
        if (p) {
          if (p.images && p.images.length > 0) {
            this.activeImageSubject.next(p.images[0]);
          }
          // Web Security: String sanitization for dynamic untrusted HTML
          this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(p.description);
          
          // Track recently viewed
          this.recentService.addViewedProduct(p);
        }
      })
    );
    
    // Fetch related products based on the viewed product's category
    this.relatedProducts$ = this.product$.pipe(
      switchMap(p => p ? this.productService.getProducts().pipe(
        map(prods => prods.filter(prod => prod.category === p.category && prod.id !== p.id).slice(0, 4))
      ) : of([]))
    );
  }

  setActiveImage(img: string) {
    this.activeImageSubject.next(img);
  }

  updateQuantity(newQty: number) {
    this.quantitySubject.next(newQty);
  }

  addToCart(product: any, qty: number) {
    if (product) {
      this.cartService.addToCart(product, qty);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
