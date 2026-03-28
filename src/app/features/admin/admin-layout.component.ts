import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div class="p-6 border-b border-gray-50">
          <a routerLink="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span class="font-bold text-xl tracking-tight">Admin Portal</span>
          </a>
        </div>
        
        <nav class="flex-1 p-4 space-y-1">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
            <i class="ri-dashboard-line"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="active" class="nav-link">
            <i class="ri-shopping-bag-3-line"></i>
            <span>Products</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-link">
            <i class="ri-file-list-3-line"></i>
            <span>Orders</span>
          </a>
        </nav>

        <div class="p-4 border-t border-gray-50">
          <button (click)="logout()" class="nav-link text-red-500 hover:bg-red-50 w-full text-left">
            <i class="ri-logout-box-line"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div class="text-sm text-gray-400">Welcome back, Admin</div>
          <div class="flex items-center gap-4">
            <button class="p-2 text-gray-400 hover:text-gray-600"><i class="ri-notification-3-line text-lg"></i></button>
            <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
          </div>
        </header>

        <div class="content min-h-[calc(100vh-64px)]">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .nav-link {
      @apply flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-medium transition-all duration-200;
    }
    .nav-link:hover {
      @apply bg-gray-50 text-gray-900;
    }
    .nav-link.active {
      @apply bg-primary/5 text-primary shadow-sm;
    }
    .nav-link i {
      @apply text-xl;
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
