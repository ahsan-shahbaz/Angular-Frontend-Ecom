import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { LoadingSkeletonComponent } from '../../shared/ui/loading-skeleton/loading-skeleton.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoadingSkeletonComponent, ButtonComponent],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <span class="badge">New Collection 2026</span>
          <h1 class="hero-title">Discover the Next Level of Premium Tech & Lifestyle.</h1>
          <p class="hero-subtitle">
            Upgrade your daily routine with our meticulously curated collection of world-class products. 
            Engineered for excellence, designed for you.
          </p>
          <div class="hero-actions">
            <app-button size="lg" routerLink="/products">Shop the Collection</app-button>
            <app-button variant="secondary" size="lg" routerLink="/categories">Explore Categories</app-button>
          </div>
        </div>
        <div class="hero-graphics">
          <div class="glow-orb"></div>
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000" class="hero-image" alt="Premium Audio">
        </div>
      </section>

      <!-- Trusted By -->
      <section class="brands-section">
        <p>TRUSTED BY INNOVATIVE BRANDS AROUND THE GLOBE</p>
        <div class="brand-logos">
          <span>Sony</span>
          <span>Apple</span>
          <span>Bose</span>
          <span>Nike</span>
          <span>Samsung</span>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="featured-section">
        <div class="section-header">
          <h2>Trending Right Now</h2>
          <app-button variant="secondary" routerLink="/products">View All</app-button>
        </div>
        
        <div class="products-grid">
          <ng-container *ngIf="featured$ | async as products; else loading">
            <app-product-card 
              *ngFor="let product of products" 
              [product]="product">
            </app-product-card>
          </ng-container>
          <ng-template #loading>
            <app-loading-skeleton *ngFor="let i of [1,2,3,4]"></app-loading-skeleton>
          </ng-template>
        </div>
      </section>

      <!-- Recently Viewed Products -->
      <section class="recently-viewed-section" *ngIf="recentService.items().length > 0">
        <div class="section-header">
          <div class="badge-title">
             <span class="badge">History</span>
             <h2>Based on Your Recent Views</h2>
          </div>
        </div>
        
        <div class="products-grid">
           <app-product-card 
             *ngFor="let product of recentService.items()" 
             [product]="product">
           </app-product-card>
        </div>
      </section>

      <!-- Feature Highlight -->
      <section class="highlight-section">
        <div class="highlight-image">
           <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000" alt="Watch">
        </div>
        <div class="highlight-content">
          <h2>Seamless Design. Flawless Engineering.</h2>
          <p>
            Experience the harmony of form and function. Our premium selection embodies a philosophy 
            where technology meets artistry, bringing you products that are not only powerful but beautiful.
          </p>
          <ul class="features-list">
             <li>✓ Uncompromising Quality Standards</li>
             <li>✓ Global 2-Year Warranty</li>
             <li>✓ 30-Day Hassle-Free Returns</li>
          </ul>
          <app-button size="md">Learn Our Story</app-button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
      gap: 5rem;
      padding-bottom: 4rem;
    }

    /* Hero */
    .hero-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      min-height: 70vh;
      position: relative;
    }
    .badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .hero-title {
      font-size: 3.5rem;
      line-height: 1.1;
      font-weight: 800;
      margin: 0 0 1.5rem 0;
      background: linear-gradient(135deg, var(--text-color, #111827), #4b5563);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-color-muted, #4b5563);
      line-height: 1.6;
      margin-bottom: 2.5rem;
      max-width: 90%;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
    }
    .hero-graphics {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-image {
      width: 100%;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      z-index: 2;
    }
    .glow-orb {
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      filter: blur(40px);
    }

    /* Brands */
    .brands-section {
      text-align: center;
      padding: 3rem 0;
      border-top: 1px solid var(--border-color, #e5e7eb);
      border-bottom: 1px solid var(--border-color, #e5e7eb);
    }
    .brands-section p {
      font-size: 0.875rem;
      font-weight: 600;
      color: #9ca3af;
      letter-spacing: 0.1em;
      margin-bottom: 2rem;
    }
    .brand-logos {
      display: flex;
      justify-content: center;
      gap: 4rem;
      flex-wrap: wrap;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-color-muted, #d1d5db);
      opacity: 0.6;
      filter: grayscale(100%);
      transition: opacity 0.3s;
    }
    .brand-logos:hover {
      opacity: 1;
    }

    /* Featured */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }
    .section-header h2 {
      font-size: 2rem;
      margin: 0;
      color: var(--text-color, #111827);
    }
    .badge-title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .badge-title .badge {
      margin-bottom: 0.5rem;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    /* Highlight */
    .highlight-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      background: var(--card-bg, #ffffff);
      padding: 4rem;
      border-radius: 24px;
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
    }
    .highlight-image img {
      width: 100%;
      border-radius: 16px;
    }
    .highlight-content h2 {
      font-size: 2.5rem;
      margin: 0 0 1.5rem 0;
      color: var(--text-color, #111827);
    }
    .highlight-content p {
      font-size: 1.125rem;
      color: var(--text-color-muted, #4b5563);
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2.5rem 0;
    }
    .features-list li {
      margin-bottom: 1rem;
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--text-color, #374151);
    }

    /* Dark Theme Adjustments */
    :host-context(.dark-theme) {
      --text-color: #f9fafb;
      --text-color-muted: #9ca3af;
      --border-color: #374151;
      --card-bg: #1f2937;
    }
    :host-context(.dark-theme) .hero-title {
      background: linear-gradient(135deg, #f9fafb, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    :host-context(.dark-theme) .brand-logos {
      color: #6b7280;
    }

    @media (max-width: 1024px) {
      .hero-section { grid-template-columns: 1fr; text-align: center; }
      .hero-title { font-size: 2.5rem; }
      .hero-actions { justify-content: center; }
      .hero-subtitle { margin-left: auto; margin-right: auto; }
      .products-grid { grid-template-columns: repeat(2, 1fr); }
      .highlight-section { grid-template-columns: 1fr; padding: 2rem; }
    }
    @media (max-width: 640px) {
      .products-grid { grid-template-columns: 1fr; }
      .hero-actions { flex-direction: column; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  public recentService = inject(RecentlyViewedService);
  
  featured$!: Observable<Product[]>;

  ngOnInit() {
    this.featured$ = this.productService.getFeaturedProducts();
  }
}
