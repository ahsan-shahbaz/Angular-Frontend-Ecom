import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="nav-brand" routerLink="/">
        StorePOC
      </div>
      
      <nav class="nav-links">
        <a routerLink="/products" routerLinkActive="active">Products</a>
      </nav>

      <div class="nav-actions">
        <button class="theme-toggle" (click)="themeService.toggleTheme()" title="Toggle Theme">
          {{ (themeService.isDarkMode$ | async) ? '🌙' : '☀️' }}
        </button>

        <a routerLink="/wishlist" class="cart-link" title="Wishlist">
          ❤️ <span class="badge" *ngIf="wishlistService.wishlistCount() > 0">{{ wishlistService.wishlistCount() }}</span>
        </a>

        <a routerLink="/cart" class="cart-link" title="Cart">
          🛒 <span class="badge" *ngIf="cartItemCount$ | async as count">{{ count }}</span>
        </a>

        <ng-container *ngIf="authService.currentUser$ | async as user; else loginLink">
          <div class="user-menu">
            <span>Hi, {{ user.firstName }}</span>
            <button class="logout-btn" (click)="authService.logout()">Logout</button>
          </div>
        </ng-container>
        <ng-template #loginLink>
          <a routerLink="/login" class="login-link">Login</a>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--header-bg, #ffffff);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      color: var(--text-color, #1f2937);
    }
    .nav-links a, .login-link {
      text-decoration: none;
      color: var(--text-color, #4b5563);
      font-weight: 500;
      margin: 0 1rem;
    }
    .nav-links .active {
      color: #3b82f6;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .cart-link {
      position: relative;
      text-decoration: none;
      font-size: 1.25rem;
    }
    .badge {
      position: absolute;
      top: -8px;
      right: -10px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .theme-toggle, .logout-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: var(--text-color, #4b5563);
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--text-color, #4b5563);
    }
    
    :host-context(.dark-theme) .header {
      --header-bg: #1f2937;
      --text-color: #f9fafb;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  themeService = inject(ThemeService);
  authService = inject(AuthService);

  cartItemCount$ = this.cartService.cartState$.pipe(
    map(state => state.totalQuantity)
  );
}
