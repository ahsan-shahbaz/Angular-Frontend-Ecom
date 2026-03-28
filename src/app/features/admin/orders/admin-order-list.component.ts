import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Order Management</h1>
        <p class="text-gray-500 mt-1">Monitor and update customer orders</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th class="px-6 py-4">Order ID</th>
                <th class="px-6 py-4">Customer</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Total</th>
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let order of orders" class="hover:bg-gray-50 transition-colors text-sm">
                <td class="px-6 py-4 font-mono text-gray-400">#{{ order.id.substring(0, 8) }}</td>
                <td class="px-6 py-4">
                  <div class="font-bold text-gray-900">{{ order.customerName }}</div>
                  <div class="text-xs text-gray-400">{{ order.customerEmail }}</div>
                </td>
                <td class="px-6 py-4">
                  <select [value]="order.status" (change)="updateStatus(order.id, $event)" 
                          class="status-select" [class]="order.status.toLowerCase()">
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td class="px-6 py-4 font-bold">{{ order.total | currency }}</td>
                <td class="px-6 py-4 text-gray-500">{{ order.date | date:'short' }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg">
                    <i class="ri-eye-line text-lg"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-select {
      @apply px-3 py-1 rounded-full text-xs font-bold border-0 outline-none cursor-pointer appearance-none text-center;
      min-width: 100px;
    }
    .status-select.pending { @apply bg-yellow-100 text-yellow-700; }
    .status-select.processing { @apply bg-blue-100 text-blue-700; }
    .status-select.shipped { @apply bg-indigo-100 text-indigo-700; }
    .status-select.delivered { @apply bg-green-100 text-green-700; }
    .status-select.cancelled { @apply bg-red-100 text-red-700; }
  `]
})
export class AdminOrderListComponent implements OnInit {
  private http = inject(HttpClient);
  orders: any[] = [];

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/stats`).subscribe((data: any) => {
      // For now, using recent orders from stats. Ideally, there's a dedicated /admin/orders endpoint.
      this.orders = data.recentOrders;
    });
  }

  updateStatus(orderId: string, event: any) {
    const status = event.target.value;
    // status update logic...
  }
}
