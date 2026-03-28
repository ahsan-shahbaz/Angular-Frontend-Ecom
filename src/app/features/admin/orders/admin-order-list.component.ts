import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-12">
      <h1 class="text-4xl font-bold tracking-tight">Order Management</h1>
      <p class="text-gray-400 mt-2 font-medium">Monitor and process incoming customer orders.</p>
    </div>

    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50/50">
          <tr>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr *ngFor="let order of orders" class="hover:bg-gray-50/30 transition-colors">
            <td class="px-8 py-6 font-mono text-xs font-bold text-primary">#{{ order.id.substring(0, 8) }}</td>
            <td class="px-8 py-6 text-sm font-bold">{{ order.customer }}</td>
            <td class="px-8 py-6">
              <span [class]="'status-badge ' + order.status.toLowerCase()">
                {{ order.status }}
              </span>
            </td>
            <td class="px-8 py-6 text-sm font-bold tracking-tight">{{ order.total | currency }}</td>
            <td class="px-8 py-6">
              <button class="text-primary font-bold text-xs hover:underline transition-all">View Details →</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .status-badge {
      @apply px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider;
    }
    .status-badge.pending { @apply bg-yellow-50 text-yellow-700; }
    .status-badge.processing { @apply bg-blue-50 text-blue-700; }
    .status-badge.shipped { @apply bg-indigo-50 text-indigo-700; }
    .status-badge.delivered { @apply bg-green-50 text-green-700; }
    .status-badge.cancelled { @apply bg-red-50 text-red-700; }
  `]
})
export class AdminOrderListComponent implements OnInit {
  private http = inject(HttpClient);
  orders: any[] = [];

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/orders`).subscribe(data => {
      this.orders = data;
    });
  }
}
