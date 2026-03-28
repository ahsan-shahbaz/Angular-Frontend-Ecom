import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-details/product-details.component').then(m => m.ProductDetailsComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
        canActivate: [authGuard]
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/profile/profile.component').then(m => m.UserProfileComponent),
        canActivate: [authGuard]
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/user/orders/order-history.component').then(m => m.OrderHistoryComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/products/product-management.component').then(m => m.ProductManagementComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orders/admin-order-list.component').then(m => m.AdminOrderListComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];