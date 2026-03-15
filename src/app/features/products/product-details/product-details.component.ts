import { Component, ChangeDetectionStrategy, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap, map, filter, shareReplay } from 'rxjs/operators';
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
          <div class="main-image-container">
             <span class="discount-badge" *ngIf="product.discountPercentage">-{{ product.discountPercentage }}%</span>
             <div class="main-image">
               <img [src]="activeImage$ | async" [alt]="product.title" class="fade-in">
             </div>
          </div>
          <div class="thumbnail-gallery" *ngIf="(product.images?.length || 0) > 1">
             <div class="thumbnail" 
                  *ngFor="let img of (product.images?.length ? product.images : [product.image])" 
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
                 <div class="stars-container">
                   <span class="star-icon">★</span>
                   <span class="score">{{ product.rating.rate }}</span>
                 </div>
                 <span class="count">{{ product.rating.count | number }} reviews</span>
               </div>
               <div class="stock-status" [ngClass]="product.stock > 0 ? 'in-stock' : 'out-of-stock'">
                 <span class="pulse-dot"></span>
                 {{ product.stock > 0 ? 'Available Now' : 'Out of Stock' }} 
                 <span class="stock-count" *ngIf="product.stock > 0 && product.stock < 10"> (Only {{ product.stock }} left!)</span>
               </div>

               <button class="wishlist-toggle-btn" 
                       [class.active]="wishlistService.isInWishlist(product.id)" 
                       (click)="wishlistService.toggleWishlist(product)"
                       title="Toggle Wishlist">
                  <i class="pi" [ngClass]="wishlistService.isInWishlist(product.id) ? 'pi-heart-fill' : 'pi-heart'"></i>
               </button>
            </div>
          </div>

          <div class="price-section">
            <div class="price-group">
              <span class="price-symbol">$</span>
              <span class="price-value">{{ product.price | number:'1.2-2' }}</span>
            </div>
            <div class="discount-info" *ngIf="product.originalPrice">
              <span class="original-price">\${{ product.originalPrice | number:'1.2-2' }}</span>
              <span class="discount-tag">Save {{ ((product.originalPrice - product.price) / product.originalPrice * 100) | number:'1.0-0' }}%</span>
            </div>
          </div>

          <div class="variant-box" *ngIf="variantOptions$ | async as variants">
            <ng-container *ngIf="selectedVariant$ | async as selectedVariant">
              <div class="variants-header">
                <h3>Select Option</h3>
                <span class="selected-label">{{ selectedVariant }}</span>
              </div>
              <div class="variant-chips">
                <button type="button"
                        class="variant-chip"
                        *ngFor="let variant of variants"
                        [class.active]="variant === selectedVariant"
                        (click)="selectVariant(variant)">
                  {{ variant }}
                </button>
              </div>
            </ng-container>
          </div>
          
          <div class="features-box" *ngIf="product.features?.length">
             <h3>Highlights</h3>
             <ul class="feature-list">
               <li *ngFor="let feature of product.features">
                 <i class="pi pi-check-circle"></i>
                 <span>{{ feature }}</span>
               </li>
             </ul>
          </div>

          <div class="actions-container">
            <div class="actions" *ngIf="quantity$ | async as qty">
              <div class="quantity-selector" [class.disabled]="product.stock === 0">
                 <button class="qty-btn" [disabled]="qty <= 1 || product.stock === 0" (click)="updateQuantity(qty - 1)">
                   <i class="pi pi-minus"></i>
                 </button>
                 <span class="qty-val">{{ qty }}</span>
                 <button class="qty-btn" [disabled]="qty >= product.stock || product.stock === 0" (click)="updateQuantity(qty + 1)">
                   <i class="pi pi-plus"></i>
                 </button>
              </div>
              <app-button size="lg" (onClick)="addToCart(product, qty)" class="add-to-cart-btn" [disabled]="product.stock === 0">
                <div class="btn-inner">
                  <i class="pi pi-shopping-cart"></i>
                  <span>Add to Cart</span>
                </div>
              </app-button>
            </div>
          </div>

          <div class="description-box">
            <div class="accordion-item">
              <h3>Product Description</h3>
              <p [innerHTML]="sanitizedDescription" class="description-text"></p>
            </div>
            
            <div class="tags-container">
               <span class="tag" *ngFor="let tag of product.tags">#{{ tag }}</span>
            </div>
          </div>

          <div class="perks-grid">
            <div class="perk-item">
              <div class="perk-icon"><i class="pi pi-truck"></i></div>
              <div class="perk-text">
                <strong>Free Delivery</strong>
                <span>On orders over $50</span>
              </div>
            </div>
            <div class="perk-item">
              <div class="perk-icon"><i class="pi pi-shield"></i></div>
              <div class="perk-text">
                <strong>Secure Payment</strong>
                <span>100% safe checkout</span>
              </div>
            </div>
            <div class="perk-item">
              <div class="perk-icon"><i class="pi pi-refresh"></i></div>
              <div class="perk-text">
                <strong>Easy Returns</strong>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="related-products-section" *ngIf="relatedProducts$ | async as relatedProducts">
        <div class="section-header">
          <h3 class="section-title">Similar Products</h3>
          <p class="section-subtitle">Customers who viewed this also liked</p>
        </div>
        <div class="related-grid">
           <app-product-card *ngFor="let rel of relatedProducts" [product]="rel"></app-product-card>
        </div>
      </div>
      
    </div>

    <ng-template #loading>
       <div class="details-wrapper">
         <div class="details-page">
           <div class="image-section"><app-loading-skeleton class="skeleton-image"></app-loading-skeleton></div>
           <div class="product-info">
              <app-loading-skeleton class="skeleton-title"></app-loading-skeleton>
              <app-loading-skeleton class="skeleton-price"></app-loading-skeleton>
              <div class="skeleton-lines">
                <app-loading-skeleton></app-loading-skeleton>
                <app-loading-skeleton style="width: 80%"></app-loading-skeleton>
                <app-loading-skeleton style="width: 60%"></app-loading-skeleton>
              </div>
           </div>
         </div>
       </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem 1rem 5rem;
      background: var(--bg-body, #fafafa);
    }
    .details-wrapper {
      max-width: 1300px;
      margin: 0 auto;
    }
    .breadcrumb {
      margin-bottom: 2.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .breadcrumb a { 
      cursor: pointer; 
      color: #6366f1; 
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb a:hover { color: #4f46e5; }
    .breadcrumb .separator { color: #cbd5e1; }
    .breadcrumb .current { color: #64748b; text-transform: capitalize; }

    .details-page {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 5rem;
      align-items: start;
    }
    
    /* Images */
    .image-section { 
      display: flex; 
      flex-direction: column; 
      gap: 1.5rem; 
      position: sticky;
      top: 2rem;
    }
    .main-image-container {
      background: white;
      border-radius: 32px;
      border: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 600px;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    }
    .main-image {
      width: 100%;
      height: 100%;
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .main-image img { 
      max-width: 100%; 
      max-height: 100%; 
      object-fit: contain; 
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .main-image-container:hover .main-image img {
      transform: scale(1.05);
    }
    .fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .discount-badge {
      position: absolute; top: 24px; left: 24px;
      background: #ef4444; color: white; padding: 6px 14px;
      border-radius: 12px; font-weight: 700; font-size: 0.9rem;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    .thumbnail-gallery { display: flex; gap: 1rem; flex-wrap: wrap; }
    .thumbnail {
      width: 90px; height: 90px;
      background: white;
      border: 2px solid transparent;
      border-radius: 16px;
      padding: 0.75rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .thumbnail img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .thumbnail.active { 
       border-color: #6366f1; 
       transform: translateY(-4px);
       box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.2);
    }
    .thumbnail:hover:not(.active) { border-color: #e2e8f0; transform: translateY(-2px); }

    /* Info */
    .product-info { display: flex; flex-direction: column; }
    .brand { color: #6366f1; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; margin-bottom: 0.75rem; }
    .title { font-size: 2.75rem; line-height: 1.1; font-weight: 900; margin-bottom: 1.5rem; color: #0f172a; letter-spacing: -0.02em; }
    
    .rating-stock { display: flex; align-items: center; gap: 2.5rem; margin-bottom: 2.5rem; }
    .rating { display: flex; align-items: center; gap: 1rem; }
    .stars-container { 
      display: flex; 
      align-items: center; 
      gap: 0.4rem; 
      background: #fffbeb; 
      padding: 4px 10px; 
      border-radius: 8px;
    }
    .star-icon { color: #f59e0b; font-size: 1.25rem; }
    .score { font-weight: 800; color: #92400e; font-size: 1.1rem; }
    .count { color: #64748b; font-weight: 500; font-size: 0.95rem; }
    
    .stock-status { 
      display: flex; 
      align-items: center; 
      gap: 0.75rem; 
      font-weight: 700; 
      font-size: 0.95rem;
      padding: 6px 14px;
      border-radius: 100px;
    }
    .in-stock { background: #f0fdf4; color: #166534; }
    .out-of-stock { background: #fef2f2; color: #991b1b; }
    
    .pulse-dot { 
      width: 10px; height: 10px; border-radius: 50%; 
      background: currentColor;
    }
    .in-stock .pulse-dot {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 101, 52, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(22, 101, 52, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 101, 52, 0); }
    }
    .stock-count { opacity: 0.8; font-weight: 500; }

    .wishlist-toggle-btn { 
      background: white; 
      border: 1px solid #e2e8f0; 
      border-radius: 14px; 
      width: 48px; height: 48px; 
      cursor: pointer; 
      display: flex; align-items: center; justify-content: center; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-left: auto;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .wishlist-toggle-btn i { font-size: 1.25rem; color: #94a3b8; transition: all 0.3s; }
    .wishlist-toggle-btn.active { border-color: #fca5a5; background: #fff1f2; }
    .wishlist-toggle-btn.active i { color: #ef4444; transform: scale(1.1); }
    .wishlist-toggle-btn:hover { border-color: #6366f1; transform: scale(1.05); }

    /* Price */
    .price-section { 
      margin-bottom: 3rem; 
      padding-bottom: 2.5rem; 
      border-bottom: 1px solid #f1f5f9; 
    }
    .price-group { display: flex; align-items: flex-start; gap: 4px; color: #0f172a; }
    .price-symbol { font-size: 1.5rem; font-weight: 800; margin-top: 0.6rem; }
    .price-value { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.04em; }
    
    .discount-info { display: flex; align-items: center; gap: 1rem; margin-top: -0.5rem; }
    .original-price { font-size: 1.25rem; color: #94a3b8; text-decoration: line-through; font-weight: 500; }
    .discount-tag { 
      background: #fdf2f8; color: #be185d; 
      padding: 4px 10px; border-radius: 6px; 
      font-size: 0.85rem; font-weight: 700;
    }

    /* Variants */
    .variant-box { margin-bottom: 3rem; }
    .variants-header { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem; }
    .variants-header h3 { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 0; }
    .selected-label { color: #6366f1; font-weight: 700; font-size: 0.95rem; }
    
    .variant-chips { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .variant-chip { 
      border: 2px solid #f1f5f9; 
      background: white; 
      padding: 10px 20px; 
      border-radius: 14px; 
      cursor: pointer; 
      font-weight: 700; 
      color: #475569; 
      transition: all 0.3s; 
      font-size: 0.95rem;
    }
    .variant-chip.active { 
      background: #0f172a; 
      color: white; 
      border-color: #0f172a; 
      box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
    }
    .variant-chip:hover:not(.active) { border-color: #cbd5e1; background: #f8fafc; }

    /* Features */
    .features-box { margin-bottom: 3rem; }
    .features-box h3 { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem; }
    .feature-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .feature-list li { 
      display: flex; align-items: center; gap: 0.75rem; 
      color: #334155; font-size: 1rem; font-weight: 500; 
    }
    .feature-list i { color: #10b981; font-size: 1.1rem; }

    /* Actions */
    .actions-container { 
      background: #fff; 
      padding: 1.5rem; 
      border-radius: 24px; 
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
      margin-bottom: 4rem;
    }
    .actions { display: flex; gap: 1.25rem; }
    .quantity-selector { 
      display: flex; align-items: center; justify-content: space-between; 
      background: #f8fafc;
      border-radius: 18px; 
      padding: 0.5rem; 
      width: 160px;
    }
    .qty-btn { 
      background: white; color: #0f172a; border: none; 
      width: 44px; height: 44px; border-radius: 14px; 
      font-size: 1rem; cursor: pointer; 
      display: flex; align-items: center; justify-content: center; 
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .qty-btn:hover:not(:disabled) { background: #f1f5f9; transform: scale(1.05); }
    .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .qty-val { font-weight: 800; font-size: 1.25rem; color: #0f172a; width: 40px; text-align: center; }
    
    .add-to-cart-btn { flex: 1; }
    ::ng-deep .add-to-cart-btn button { 
      width: 100%; height: 60px;
      background: #6366f1 !important;
      border-radius: 18px !important;
      font-size: 1.1rem !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      border: none !important;
    }
    ::ng-deep .add-to-cart-btn button:hover:not(:disabled) {
      background: #4f46e5 !important;
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.4);
    }
    .btn-inner { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-weight: 800; color: white; }
    .btn-inner i { font-size: 1.2rem; }

    /* Description */
    .description-box { margin-bottom: 4rem; }
    .accordion-item h3 { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin-bottom: 1.25rem; }
    .description-text { color: #475569; line-height: 1.8; font-size: 1.05rem; }
    
    .tags-container { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 2rem; }
    .tag { 
      background: #f1f5f9; color: #64748b; 
      padding: 6px 14px; border-radius: 10px; 
      font-size: 0.85rem; font-weight: 600; 
      transition: all 0.2s;
      cursor: default;
    }
    .tag:hover { background: #e2e8f0; color: #475569; }

    /* Perks */
    .perks-grid { 
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; 
      padding-top: 2.5rem; border-top: 1px solid #f1f5f9; 
    }
    .perk-item { display: flex; align-items: center; gap: 1rem; }
    .perk-icon { 
      width: 44px; height: 44px; 
      background: #f1f5f9; border-radius: 12px; 
      display: flex; align-items: center; justify-content: center; 
      color: #6366f1; font-size: 1.25rem;
    }
    .perk-text { display: flex; flex-direction: column; gap: 2px; }
    .perk-text strong { font-size: 0.9rem; color: #1e293b; }
    .perk-text span { font-size: 0.8rem; color: #64748b; }

    /* Related Products */
    .related-products-section { margin-top: 8rem; }
    .section-header { margin-bottom: 3rem; text-align: center; }
    .section-title { font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem; }
    .section-subtitle { color: #64748b; font-size: 1.1rem; }
    .related-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
      gap: 2.5rem; 
    }

    /* Loading Skeletons */
    .skeleton-image { height: 600px; width: 100%; border-radius: 32px; }
    .skeleton-title { height: 3rem; width: 80%; margin-bottom: 1.5rem; }
    .skeleton-price { height: 4rem; width: 40%; margin-bottom: 3rem; }
    .skeleton-lines { display: flex; flex-direction: column; gap: 1rem; }

    /* Dark Mode Polish */
    :host-context(.dark-theme) {
      background: #0f172a;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border: #1e293b;
      --surface: #1e293b;
    }
    :host-context(.dark-theme) .title { color: #f8fafc; }
    :host-context(.dark-theme) .main-image-container,
    :host-context(.dark-theme) .thumbnail,
    :host-context(.dark-theme) .actions-container,
    :host-context(.dark-theme) .wishlist-toggle-btn {
      background: #1e293b; border-color: #334155;
    }
    :host-context(.dark-theme) .price-group { color: #f8fafc; }
    :host-context(.dark-theme) .variant-chip { background: #1e293b; border-color: #334155; color: #f8fafc; }
    :host-context(.dark-theme) .variant-chip.active { background: #6366f1; border-color: #6366f1; }
    :host-context(.dark-theme) .qty-btn { background: #334155; color: #f8fafc; }
    :host-context(.dark-theme) .quantity-selector { background: #0f172a; }
    :host-context(.dark-theme) .section-title { color: #f8fafc; }

    @media (max-width: 1024px) {
      .details-page { grid-template-columns: 1fr; gap: 3rem; }
      .image-section { position: static; }
      .main-image-container { height: 500px; }
      .title { font-size: 2.25rem; }
    }
    @media (max-width: 640px) {
      .rating-stock { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .wishlist-toggle-btn { margin-left: 0; }
      .perks-grid { grid-template-columns: 1fr; }
      .feature-list { grid-template-columns: 1fr; }
      .actions { flex-direction: column; }
      .quantity-selector { width: 100%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit, OnChanges {
  @Input() id!: string; 
  
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  public wishlistService = inject(WishlistService);
  private recentService = inject(RecentlyViewedService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private productIdSubject = new BehaviorSubject<number | null>(null);

  product$: Observable<Product> = this.productIdSubject.pipe(
    filter((id): id is number => id !== null),
    switchMap(id => this.productService.getProduct(id)),
    tap(product => this.applyProductState(product)),
    shareReplay(1)
  );

  relatedProducts$: Observable<Product[]> = this.product$.pipe(
    switchMap(p => p ? this.productService.getProducts().pipe(
      map(prods => prods.filter(prod => prod.category === p.category && prod.id !== p.id).slice(0, 4))
    ) : of([]))
  );

  private activeImageSubject = new BehaviorSubject<string>('');
  activeImage$ = this.activeImageSubject.asObservable();

  private quantitySubject = new BehaviorSubject<number>(1);
  quantity$ = this.quantitySubject.asObservable();

  private variantsSubject = new BehaviorSubject<string[]>([]);
  variantOptions$ = this.variantsSubject.asObservable();

  private selectedVariantSubject = new BehaviorSubject<string>('');
  selectedVariant$ = this.selectedVariantSubject.asObservable();

  sanitizedDescription: SafeHtml = '';
  private currentStock = 0;

  ngOnInit() {
    this.pushProductId(this.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']?.currentValue) {
      this.pushProductId(changes['id'].currentValue);
    }
  }

  private pushProductId(rawId: string) {
    const numericId = Number(rawId);
    if (!isNaN(numericId) && this.productIdSubject.getValue() !== numericId) {
      this.productIdSubject.next(numericId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private applyProductState(product: Product) {
    const galleryImages = product.images && product.images.length ? product.images : [product.image];
    this.activeImageSubject.next(galleryImages[0] || '');
    this.quantitySubject.next(1);
    this.currentStock = product.stock;
    // Web Security: String sanitization for dynamic untrusted HTML
    this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(product.description);

    const variants = product.variants?.length ? product.variants :
      (product.tags?.length ? product.tags : ['Standard']);
    this.variantsSubject.next(variants);
    this.selectedVariantSubject.next(variants[0] ?? '');

    // Track recently viewed
    this.recentService.addViewedProduct(product);
  }

  setActiveImage(img: string) {
    this.activeImageSubject.next(img || this.activeImageSubject.getValue());
  }

  updateQuantity(newQty: number) {
    const maxQty = this.currentStock > 0 ? this.currentStock : newQty;
    const clamped = Math.min(Math.max(newQty, 1), maxQty);
    this.quantitySubject.next(clamped);
  }

  selectVariant(variant: string) {
    this.selectedVariantSubject.next(variant);
  }

  addToCart(product: Product, qty: number) {
    if (product) {
      const selectedVariant = this.selectedVariantSubject.getValue();
      this.cartService.addToCart(product, qty, selectedVariant);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
