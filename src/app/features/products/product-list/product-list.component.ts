import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { LoadingSkeletonComponent } from '../../../shared/ui/loading-skeleton/loading-skeleton.component';
import { InputComponent } from '../../../shared/ui/input/input.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCardComponent, LoadingSkeletonComponent, InputComponent],
  template: `
    <div class="product-list-page">
      <aside class="sidebar">
        <form [formGroup]="filterForm" class="filter-form">
          <div class="search-box">
             <app-input formControlName="search" placeholder="Search products..."></app-input>
          </div>

          <div class="filter-group">
            <h3>Category</h3>
            <select formControlName="category" class="select-input">
              <option value="">All Categories</option>
              <option *ngFor="let cat of (categories$ | async)" [value]="cat">{{ cat | titlecase }}</option>
            </select>
          </div>

          <div class="filter-group">
            <h3>Sort By</h3>
            <select formControlName="sort" class="select-input">
              <option value="none">Recommended</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </form>
      </aside>

      <section class="main-content">
        <div class="grid" *ngIf="vm$ | async as vm">
          <ng-container *ngIf="vm.loading; else content">
            <app-loading-skeleton *ngFor="let i of [1,2,3,4,5,6]"></app-loading-skeleton>
          </ng-container>

          <ng-template #content>
            <ng-container *ngIf="vm.products.length > 0; else noResults">
              <app-product-card 
                *ngFor="let product of vm.products; trackBy: trackById" 
                [product]="product">
              </app-product-card>
            </ng-container>
            <ng-template #noResults>
              <div class="no-results">
                <p>No products found matching your criteria.</p>
              </div>
            </ng-template>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .product-list-page {
      display: flex;
      gap: 2rem;
    }
    .sidebar {
      width: 250px;
      flex-shrink: 0;
    }
    .main-content {
      flex: 1;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    .filter-group {
      margin-bottom: 1.5rem;
    }
    .filter-group h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: var(--text-color, #374151);
    }
    .select-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color, #d1d5db);
      border-radius: 6px;
      background: var(--input-bg, white);
      color: var(--text-color, #1f2937);
      outline: none;
    }
    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem;
      color: #6b7280;
    }
    
    :host-context(.dark-theme) {
      --border-color: #4b5563;
      --input-bg: #374151;
      --text-color: #f9fafb;
    }

    @media (max-width: 768px) {
      .product-list-page { flex-direction: column; }
      .sidebar { width: 100%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  filterForm!: FormGroup;
  categories$!: Observable<string[]>;

  private loadingSubject = new BehaviorSubject<boolean>(true);

  vm$!: Observable<{ products: Product[], loading: boolean }>;

  ngOnInit() {
    this.initForm();
    this.categories$ = this.productService.getCategories();
    
    const products$ = this.productService.getProducts();

    const filters$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );

    this.vm$ = combineLatest([products$, filters$, this.loadingSubject]).pipe(
      map(([products, filters, loading]) => {
        let filtered = [...products];

        if (filters.search) {
          const lowerTerms = filters.search.toLowerCase();
          filtered = filtered.filter(p => p.title.toLowerCase().includes(lowerTerms));
        }

        if (filters.category) {
          filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters.sort === 'asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'desc') {
          filtered.sort((a, b) => b.price - a.price);
        }

        if (loading) setTimeout(() => this.loadingSubject.next(false), 500); // Simulate mock loading

        return { products: filtered, loading };
      })
    );
  }

  private initForm() {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      sort: ['none']
    });
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }
}
