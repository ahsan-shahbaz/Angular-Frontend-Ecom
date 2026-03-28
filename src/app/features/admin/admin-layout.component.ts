import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container flex h-screen bg-gray-50/50">
      <!-- Sidebar -->
      <aside class="w-72 bg-white border-r border-gray-100 flex flex-col">
        <div class="p-8">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Admin Portal
          </h2>
        </div>

        <nav class="flex-1 px-4 space-y-2">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/products" routerLinkActive="active" class="nav-link">
            <span class="icon">📦</span> Products
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-link">
            <span class="icon">📜</span> Orders
          </a>
        </nav>

        <div class="p-8 border-t border-gray-50 mt-auto">
          <button (click)="logout()" class="flex items-center gap-3 text-red-500 font-bold hover:translate-x-1 transition-transform">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-12">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .nav-link {
      @apply flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-500 font-bold transition-all hover:bg-gray-50;
    }
    .nav-link.active {
      @apply bg-primary/10 text-primary shadow-sm shadow-primary/5;
    }
    .icon { @apply text-xl; }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
