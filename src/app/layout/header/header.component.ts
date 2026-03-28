import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header" [class.scrolled]="isScrolled">
      <div class="container header-inner">
        <!-- Logo -->
        <a class="brand" routerLink="/">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span class="brand-text">Luxe<span class="brand-accent">Store</span></span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-desktop">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/products" routerLinkActive="active">Shop</a>
          <a routerLink="/categories" routerLinkActive="active">Categories</a>
          <a routerLink="/deals" routerLinkActive="active" class="nav-deals">Deals</a>
        </nav>

        <!-- Search Bar -->
        <div class="search-wrapper" [class.expanded]="isSearchFocused">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search for products..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchInput($event)"
              (keydown.enter)="submitSearch()"
              (focus)="isSearchFocused = true"
              (blur)="isSearchFocused = false"
            >
            <button class="search-clear" *ngIf="searchQuery" (click)="clearSearch()">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions">
          <!-- Theme Toggle -->
          <button class="action-btn theme-toggle" (click)="themeService.toggleTheme()" title="Toggle theme">
            <ng-container *ngIf="themeService.isDarkMode$ | async; else sunIcon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </ng-container>
            <ng-template #sunIcon>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </ng-template>
          </button>

          <!-- Wishlist -->
          <a routerLink="/wishlist" class="action-btn" title="Wishlist">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="badge" *ngIf="wishlistService.wishlistCount() > 0">{{ wishlistService.wishlistCount() }}</span>
          </a>

          <!-- Cart -->
          <a routerLink="/cart" class="action-btn cart-btn" title="Cart">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="badge cart-badge" *ngIf="cartItemCount$ | async as count">{{ count }}</span>
          </a>

          <!-- User Menu -->
          <ng-container *ngIf="authService.currentUser$ | async as user; else loginBtn">
            <div class="user-menu" (click)="toggleMenu($event)">
              <button class="action-btn user-btn">
                <div class="user-avatar">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
                <span class="user-name">{{ user.firstName }}</span>
                <svg class="dropdown-chevron" [class.rotated]="isMenuOpen" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <!-- Dropdown -->
              <div class="dropdown" [class.show]="isMenuOpen">
                <div class="dropdown-header">
                  <div class="user-avatar-large">{{ user.firstName[0] }}{{ user.lastName[0] }}</div>
                  <div class="user-info">
                    <span class="user-fullname">{{ user.firstName }} {{ user.lastName }}</span>
                    <span class="user-email">{{ user.email }}</span>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a routerLink="/profile" class="dropdown-item">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </a>
                <a routerLink="/orders" class="dropdown-item">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  My Orders
                </a>
                <a *ngIf="authService.isAdmin()" routerLink="/admin" class="dropdown-item admin">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Admin Portal
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout" (click)="logout()">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </ng-container>

          <ng-template #loginBtn>
            <a routerLink="/login" class="btn-login">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Sign In
            </a>
          </ng-template>

          <!-- Mobile Menu Toggle -->
          <button class="mobile-menu-toggle" (click)="isMobileMenuOpen = !isMobileMenuOpen">
            <svg *ngIf="!isMobileMenuOpen" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg *ngIf="isMobileMenuOpen" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.show]="isMobileMenuOpen">
        <nav class="mobile-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="isMobileMenuOpen = false">Home</a>
          <a routerLink="/products" routerLinkActive="active" (click)="isMobileMenuOpen = false">Shop</a>
          <a routerLink="/categories" routerLinkActive="active" (click)="isMobileMenuOpen = false">Categories</a>
          <a routerLink="/deals" routerLinkActive="active" (click)="isMobileMenuOpen = false" class="mobile-deals">Deals</a>
          <a routerLink="/wishlist" (click)="isMobileMenuOpen = false">Wishlist</a>
          <a routerLink="/cart" (click)="isMobileMenuOpen = false">Cart</a>
          <ng-container *ngIf="authService.currentUser$ | async as user; else mobileLogin">
            <a routerLink="/profile" (click)="isMobileMenuOpen = false">Profile</a>
            <a routerLink="/orders" (click)="isMobileMenuOpen = false">My Orders</a>
            <a *ngIf="authService.isAdmin()" routerLink="/admin" (click)="isMobileMenuOpen = false">Admin Portal</a>
            <button class="mobile-logout" (click)="logout(); isMobileMenuOpen = false">Logout</button>
          </ng-container>
          <ng-template #mobileLogin>
            <a routerLink="/login" class="mobile-login" (click)="isMobileMenuOpen = false">Sign In</a>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
    }

    .header {
      background: var(--header-bg);
      backdrop-filter: var(--header-backdrop);
      -webkit-backdrop-filter: var(--header-backdrop);
      border-bottom: 1px solid var(--header-border);
      box-shadow: var(--header-shadow);
      transition: all var(--duration-base) var(--ease-out);
    }

    .header.scrolled {
      background: var(--header-bg-scrolled);
      box-shadow: var(--shadow-lg);
    }

    .header-inner {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      height: 72px;
      padding: 0 var(--space-6);
    }

    /* Brand/Logo */
    .brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      color: var(--text-main);
      flex-shrink: 0;
    }

    .brand:hover {
      text-decoration: none;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--gradient-primary);
      border-radius: var(--radius-lg);
      color: white;
      box-shadow: var(--button-primary-shadow);
      transition: transform var(--duration-base) var(--ease-spring);
    }

    .brand:hover .brand-icon {
      transform: rotate(-10deg) scale(1.05);
    }

    .brand-text {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      letter-spacing: var(--tracking-tight);
    }

    .brand-accent {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Navigation */
    .nav-desktop {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .nav-desktop a {
      padding: var(--space-2) var(--space-4);
      color: var(--text-muted);
      font-weight: var(--font-medium);
      font-size: var(--text-sm);
      text-decoration: none;
      border-radius: var(--radius-lg);
      transition: all var(--duration-fast) var(--ease-out);
      position: relative;
    }

    .nav-desktop a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: all var(--duration-base) var(--ease-spring);
      transform: translateX(-50%);
    }

    .nav-desktop a:hover {
      color: var(--text-main);
      background: var(--surface-hover);
    }

    .nav-desktop a.active::after {
      width: 60%;
    }

    .nav-desktop a.active {
      color: var(--primary-500);
    }

    .nav-desktop .nav-deals {
      background: var(--accent-color-subtle);
      color: var(--accent-color) !important;
    }

    .nav-desktop .nav-deals:hover {
      background: var(--coral-200);
    }

    /* Search Bar */
    .search-wrapper {
      flex: 1;
      max-width: 420px;
      transition: max-width var(--duration-base) var(--ease-spring);
    }

    .search-wrapper.expanded {
      max-width: 520px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: var(--space-4);
      color: var(--text-muted);
      pointer-events: none;
      transition: color var(--duration-fast) var(--ease-out);
    }

    .search-box:focus-within .search-icon {
      color: var(--primary-500);
    }

    .search-box input {
      width: 100%;
      padding: var(--space-3) var(--space-10) var(--space-3) var(--space-10);
      border: 2px solid var(--input-border);
      border-radius: var(--radius-full);
      background: var(--input-bg);
      color: var(--text-main);
      font-size: var(--text-sm);
      transition: all var(--duration-base) var(--ease-out);
    }

    .search-box input::placeholder {
      color: var(--text-muted);
    }

    .search-box input:hover {
      border-color: var(--primary-300);
    }

    .search-box input:focus {
      border-color: var(--primary-400);
      box-shadow: var(--input-shadow-focus);
      outline: none;
    }

    .search-clear {
      position: absolute;
      right: var(--space-3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: var(--surface-200);
      border: none;
      border-radius: var(--radius-full);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.8rem;
      padding: 4px;
      line-height: 1;
      transition: all var(--duration-fast) var(--ease-out);
    }

    .search-clear:hover {
      background: var(--surface-300);
      color: var(--text-main);
    }

    /* Actions */
    .actions {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .action-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      color: var(--text-muted);
      border-radius: var(--radius-lg);
      transition: all var(--duration-fast) var(--ease-out);
    }

    .action-btn:hover {
      color: var(--text-main);
      background: var(--surface-hover);
    }

    .action-btn.active {
      color: var(--primary-500);
      background: var(--primary-100);
    }

    .action-btn .badge {
      position: absolute;
      top: 2px;
      right: 2px;
      min-width: 18px;
      height: 18px;
      padding: 0 var(--space-1);
      background: var(--gradient-accent);
      color: white;
      font-size: 10px;
      font-weight: var(--font-bold);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .action-btn .cart-badge {
      background: var(--gradient-primary);
    }

    .theme-toggle svg {
      transition: transform var(--duration-base) var(--ease-spring);
    }

    .theme-toggle:hover svg {
      transform: rotate(20deg);
    }

    /* User Menu */
    .user-menu {
      position: relative;
    }

    .user-btn {
      width: auto;
      padding: var(--space-1) var(--space-2);
      gap: var(--space-2);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: var(--gradient-primary);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
    }

    .user-name {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-main);
    }

    .dropdown-chevron {
      color: var(--text-muted);
      transition: transform var(--duration-base) var(--ease-spring);
    }

    .dropdown-chevron.rotated {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .dropdown {
      position: absolute;
      top: calc(100% + var(--space-2));
      right: 0;
      width: 280px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-2xl);
      box-shadow: var(--glass-shadow-lg);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all var(--duration-base) var(--ease-spring);
      z-index: var(--z-dropdown);
      overflow: hidden;
    }

    .dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-5);
      background: var(--surface-50);
    }

    .user-avatar-large {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--text-lg);
      font-weight: var(--font-bold);
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-fullname {
      font-weight: var(--font-semibold);
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: var(--text-xs);
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-color);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-5);
      color: var(--text-main);
      font-size: var(--text-sm);
      text-decoration: none;
      transition: all var(--duration-fast) var(--ease-out);
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }

    .dropdown-item svg {
      color: var(--text-muted);
      transition: color var(--duration-fast) var(--ease-out);
    }

    .dropdown-item:hover {
      background: var(--surface-hover);
      text-decoration: none;
    }

    .dropdown-item:hover svg {
      color: var(--primary-500);
    }

    .dropdown-item.admin {
      color: var(--accent-color);
    }

    .dropdown-item.admin svg {
      color: var(--accent-color);
    }

    .dropdown-item.logout {
      color: var(--error-500);
    }

    .dropdown-item.logout svg {
      color: var(--error-500);
    }

    .dropdown-item.logout:hover {
      background: var(--error-50);
    }

    /* Login Button */
    .btn-login {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--surface-100);
      color: var(--text-main);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      border-radius: var(--radius-lg);
      text-decoration: none;
      transition: all var(--duration-fast) var(--ease-out);
    }

    .btn-login:hover {
      background: var(--surface-200);
      text-decoration: none;
    }

    /* Mobile Menu */
    .mobile-menu-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      color: var(--text-main);
      border-radius: var(--radius-lg);
      transition: background var(--duration-fast) var(--ease-out);
    }

    .mobile-menu-toggle:hover {
      background: var(--surface-hover);
    }

    .mobile-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--glass-bg);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-top: 1px solid var(--glass-border);
      border-bottom: 1px solid var(--glass-border);
      box-shadow: var(--glass-shadow-lg);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all var(--duration-base) var(--ease-spring);
    }

    .mobile-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      padding: var(--space-4);
    }

    .mobile-nav a,
    .mobile-nav button {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      color: var(--text-main);
      font-size: var(--text-base);
      font-weight: var(--font-medium);
      text-decoration: none;
      border-radius: var(--radius-lg);
      transition: all var(--duration-fast) var(--ease-out);
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .mobile-nav a:hover,
    .mobile-nav button:hover {
      background: var(--surface-hover);
      text-decoration: none;
    }

    .mobile-nav a.active {
      background: var(--primary-100);
      color: var(--primary-500);
    }

    .mobile-nav .mobile-deals {
      background: var(--accent-color-subtle);
      color: var(--accent-color);
    }

    .mobile-nav .mobile-deals:hover {
      background: var(--coral-200);
    }

    .mobile-nav .mobile-login {
      background: var(--gradient-primary);
      color: white;
      margin-top: var(--space-4);
      justify-content: center;
    }

    .mobile-nav .mobile-login:hover {
      box-shadow: var(--button-primary-shadow);
    }

    .mobile-nav .mobile-logout {
      color: var(--error-500);
    }

    .mobile-nav .mobile-logout:hover {
      background: var(--error-50);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .nav-desktop {
        display: none;
      }

      .search-wrapper {
        max-width: 300px;
      }
    }

    @media (max-width: 768px) {
      .header-inner {
        gap: var(--space-3);
      }

      .brand-text {
        display: none;
      }

      .search-wrapper {
        max-width: none;
        flex: 1;
      }

      .user-name {
        display: none;
      }

      .mobile-menu-toggle {
        display: flex;
      }

      .mobile-menu {
        display: block;
      }
    }

    @media (max-width: 480px) {
      .actions {
        gap: var(--space-1);
      }

      .action-btn {
        width: 40px;
        height: 40px;
      }

      .theme-toggle {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = '';
  isMenuOpen = false;
  isMobileMenuOpen = false;
  isSearchFocused = false;
  isScrolled = false;

  private searchSubject$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  cartItemCount$ = this.cartService.cartState$.pipe(
    map(state => state.totalQuantity)
  );

  ngOnInit() {
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.navigateSearch(query);
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  private onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  onSearchInput(value: string) {
    this.searchSubject$.next(value);
  }

  submitSearch() {
    this.navigateSearch(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.router.navigate(['/products']);
  }

  private navigateSearch(query: string) {
    const trimmed = query.trim();
    if (trimmed) {
      this.router.navigate(['/products'], { queryParams: { search: trimmed } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.isMenuOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.isMenuOpen = false;
    }
  }
}
