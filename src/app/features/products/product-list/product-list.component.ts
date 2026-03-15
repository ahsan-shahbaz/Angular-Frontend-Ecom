import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { Product } from '../../../core/models/product.model';
import { ProductFilters } from '../../../core/models/product-filters.model';
import { selectAllProducts, selectProductError, selectProductFilters, selectProductLoading } from '../../../core/state/product.selectors';
import { loadProducts, resetFilters, updateFilters } from '../../../core/state/product.actions';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SkeletonCardComponent } from '../../../shared/components/skeleton-card/skeleton-card.component';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, SkeletonCardComponent],
  template: `
    <div class="product-list-container">
      <header class="list-header">
        <div class="header-content">
          <h1>Our Collection</h1>
          <p>Discover our range of premium products curated just for you.</p>
        </div>
        
        <div class="filter-bar" *ngIf="filterModel as filters">
          <div class="filter-grid">
            <div class="filter-group">
              <label>Price Range</label>
              <div class="price-inputs">
                <input type="number" placeholder="Min" [ngModel]="filters.priceMin" (ngModelChange)="updateNumericFilter('priceMin', $event)">
                <span>-</span>
                <input type="number" placeholder="Max" [ngModel]="filters.priceMax" (ngModelChange)="updateNumericFilter('priceMax', $event)">
              </div>
            </div>

            <div class="filter-group">
              <label>Category</label>
              <select [ngModel]="filters.category" (ngModelChange)="updateTextFilter('category', $event)">
                <option value="">All</option>
                <option *ngFor="let category of (categories$ | async)" [value]="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label>Brand</label>
              <select [ngModel]="filters.brand" (ngModelChange)="updateTextFilter('brand', $event)">
                <option value="">All</option>
                <option *ngFor="let brand of (brands$ | async)" [value]="brand">
                  {{ brand }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label>Rating</label>
              <select [ngModel]="filters.rating" (ngModelChange)="updateNumericFilter('rating', $event)">
                <option value="">Any</option>
                <option *ngFor="let rating of ratingOptions" [ngValue]="rating">
                  {{ rating }}+ stars
                </option>
              </select>
            </div>

            <div class="filter-group checkbox">
              <label>
                <input type="checkbox" [ngModel]="filters.inStockOnly" (ngModelChange)="updateStock($event)">
                In Stock
              </label>
            </div>

            <div class="filter-actions">
              <button class="apply-btn" (click)="applyFilters()">Apply Filters</button>
              <button class="clear-btn" (click)="clearFilters()" [disabled]="!hasActiveFilters(filters)">
                Clear
              </button>
            </div>
          </div>

          <div class="stats" *ngIf="(products$ | async) as products">
            {{ products.length }} items shown
          </div>
        </div>
      </header>

      <!-- Error State -->
      <div class="error-state" *ngIf="error$ | async as error">
        <div class="error-card">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#ef4444"/>
          </svg>
          <h2>Unable to load products</h2>
          <p>{{ error }}</p>
          <button (click)="retry()">Try Again</button>
        </div>
      </div>

      <!-- Skeleton Loading State -->
      <div class="product-grid" *ngIf="loading$ | async">
        <app-skeleton-card *ngFor="let i of [1,2,3,4,5,6,7,8]"></app-skeleton-card>
      </div>

      <!-- Product Grid -->
      <div class="product-grid" *ngIf="!(loading$ | async) && (products$ | async) as products">
        <app-product-card 
          *ngFor="let product of products" 
          [product]="product">
        </app-product-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!(loading$ | async) && (products$ | async)?.length === 0">
        <p>No products found matching your criteria.</p>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .list-header {
      margin-bottom: 3rem;
    }
    .header-content h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 0.5rem;
      background: linear-gradient(90deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header-content p {
      color: #64748b;
      font-size: 1.125rem;
    }
    .filter-bar {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      align-items: center;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: #0f172a;
      font-weight: 600;
    }
    .filter-group label { font-size: 0.9rem; }
    .filter-group select,
    .filter-group input {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.6rem 0.75rem;
      font-size: 0.95rem;
      color: #0f172a;
      background: #fff;
    }
    .price-inputs {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 0.4rem;
    }
    .checkbox {
      flex-direction: row;
      align-items: center;
      gap: 0.6rem;
      font-weight: 500;
      color: #0f172a;
    }
    .checkbox input {
      width: 18px;
      height: 18px;
    }
    .filter-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: flex-start;
    }
    .apply-btn, .clear-btn {
      border: none;
      border-radius: 10px;
      padding: 0.65rem 1.25rem;
      font-weight: 700;
      cursor: pointer;
    }
    .apply-btn {
      background: linear-gradient(90deg, #6366f1, #a855f7);
      color: #fff;
    }
    .clear-btn {
      background: #e2e8f0;
      color: #0f172a;
    }
    .clear-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .filter-bar .stats {
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 600;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    .error-state, .empty-state {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
      text-align: center;
    }
    .error-card {
      background: white;
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      max-width: 400px;
    }
    .error-card h2 { color: #1e293b; margin: 1rem 0; }
    .error-card p { color: #64748b; margin-bottom: 2rem; }
    .error-card button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }
    
    @media (max-width: 768px) {
      .product-list-container { padding: 1rem; }
      .header-content h1 { font-size: 2rem; }
      .product-grid { gap: 1rem; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  products$: Observable<Product[]> = this.store.select(selectAllProducts);
  loading$: Observable<boolean> = this.store.select(selectProductLoading);
  error$: Observable<string | null> = this.store.select(selectProductError);
  filters$: Observable<ProductFilters> = this.store.select(selectProductFilters);
  categories$ = this.productService.getCategories().pipe(shareReplay(1));
  brands$ = this.products$.pipe(
    map(products => Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort()),
    shareReplay(1)
  );

  filterModel: ProductFilters = {
    priceMin: null,
    priceMax: null,
    category: null,
    brand: null,
    rating: null,
    inStockOnly: false
  };

  ratingOptions = [5, 4, 3, 2, 1];

  ngOnInit() {
    this.filters$.pipe(take(1)).subscribe((filters) => {
      const queryFilters = this.parseFiltersFromQuery();
      const normalized = this.normalizeFilters({ ...filters, ...queryFilters });
      this.filterModel = { ...normalized };
      this.store.dispatch(updateFilters({ filters: normalized }));
      this.syncQueryParams(normalized);
    });
  }

  retry() {
    this.store.dispatch(loadProducts());
  }

  updateNumericFilter(key: 'priceMin' | 'priceMax' | 'rating', value: any) {
    const parsed = value === null || value === '' ? null : Number(value);
    const numericValue = parsed === null || Number.isNaN(parsed) ? null : parsed;
    this.filterModel = { ...this.filterModel, [key]: numericValue } as ProductFilters;
  }

  updateTextFilter(key: 'category' | 'brand', value: string) {
    this.filterModel = { ...this.filterModel, [key]: value || null };
  }

  updateStock(inStock: boolean) {
    this.filterModel = { ...this.filterModel, inStockOnly: inStock };
  }

  applyFilters() {
    const normalized = this.normalizeFilters(this.filterModel);
    this.filterModel = { ...normalized };
    this.store.dispatch(updateFilters({ filters: normalized }));
    this.syncQueryParams(normalized);
  }

  clearFilters() {
    this.filterModel = {
      priceMin: null,
      priceMax: null,
      category: null,
      brand: null,
      rating: null,
      inStockOnly: false
    };
    this.store.dispatch(resetFilters());
    this.syncQueryParams(this.filterModel);
  }

  hasActiveFilters(filters: ProductFilters): boolean {
    return Boolean(
      filters.priceMin !== null ||
      filters.priceMax !== null ||
      filters.category ||
      filters.brand ||
      filters.rating !== null ||
      filters.inStockOnly
    );
  }

  private syncQueryParams(filters: ProductFilters) {
    const queryParams: Record<string, string> = {};

    if (filters.priceMin !== null) {
      queryParams['priceMin'] = String(filters.priceMin);
    }
    if (filters.priceMax !== null) {
      queryParams['priceMax'] = String(filters.priceMax);
    }
    if (filters.category) {
      queryParams['category'] = filters.category;
    }
    if (filters.brand) {
      queryParams['brand'] = filters.brand;
    }
    if (filters.rating !== null) {
      queryParams['rating'] = String(filters.rating);
    }
    if (filters.inStockOnly) {
      queryParams['inStock'] = 'true';
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  private parseFiltersFromQuery(): Partial<ProductFilters> {
    const params = this.route.snapshot.queryParamMap;
    const filters: Partial<ProductFilters> = {};

    const priceMin = params.get('priceMin');
    const priceMax = params.get('priceMax');
    const category = params.get('category');
    const brand = params.get('brand');
    const rating = params.get('rating');
    const inStock = params.get('inStock');

    if (priceMin !== null && !isNaN(Number(priceMin))) {
      filters.priceMin = Number(priceMin);
    }
    if (priceMax !== null && !isNaN(Number(priceMax))) {
      filters.priceMax = Number(priceMax);
    }
    if (category) {
      filters.category = category;
    }
    if (brand) {
      filters.brand = brand;
    }
    if (rating !== null && !isNaN(Number(rating))) {
      filters.rating = Number(rating);
    }
    if (inStock !== null) {
      filters.inStockOnly = inStock === 'true';
    }

    return filters;
  }

  private normalizeFilters(filters: ProductFilters): ProductFilters {
    return {
      priceMin: filters.priceMin !== null && filters.priceMin !== undefined ? Number(filters.priceMin) : null,
      priceMax: filters.priceMax !== null && filters.priceMax !== undefined ? Number(filters.priceMax) : null,
      category: filters.category ? filters.category : null,
      brand: filters.brand ? filters.brand : null,
      rating: filters.rating !== null && filters.rating !== undefined ? Number(filters.rating) : null,
      inStockOnly: filters.inStockOnly
    };
  }
}
