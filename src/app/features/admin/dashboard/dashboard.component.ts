import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard p-6">
      <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stats-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total Revenue</p>
          <h2 class="text-2xl font-bold text-primary">{{ stats?.totalRevenue | currency }}</h2>
        </div>
        <div class="stats-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total Orders</p>
          <h2 class="text-2xl font-bold">{{ stats?.totalOrders }}</h2>
        </div>
        <div class="stats-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total Products</p>
          <h2 class="text-2xl font-bold">{{ stats?.totalProducts }}</h2>
        </div>
        <div class="stats-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total Users</p>
          <h2 class="text-2xl font-bold">{{ stats?.totalUsers }}</h2>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50">
          <h3 class="text-lg font-bold">Recent Orders</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th class="px-6 py-4">Order ID</th>
                <th class="px-6 py-4">Customer</th>
                <th class="px-6 py-4">Total</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let order of stats?.recentOrders" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-sm">#{{ order.id.substring(0, 8) }}</td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium">{{ order.customerName }}</div>
                  <div class="text-xs text-gray-400">{{ order.customerEmail }}</div>
                </td>
                <td class="px-6 py-4 text-sm font-bold">{{ order.total | currency }}</td>
                <td class="px-6 py-4">
                  <span [class]="'status-badge ' + order.status.toLowerCase()">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 text-xs">
                  {{ order.date | date:'medium' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-badge {
      @apply px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider;
    }
    .status-badge.pending { @apply bg-yellow-100 text-yellow-700; }
    .status-badge.processing { @apply bg-blue-100 text-blue-700; }
    .status-badge.shipped { @apply bg-indigo-100 text-indigo-700; }
    .status-badge.delivered { @apply bg-green-100 text-green-700; }
    .status-badge.cancelled { @apply bg-red-100 text-red-700; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  stats: any;

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/admin/stats`).subscribe(data => {
      this.stats = data;
    });
  }
}
