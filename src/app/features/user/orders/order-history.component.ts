import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-history max-w-4xl mx-auto py-12">
      <h1 class="text-3xl font-bold mb-8">Order History</h1>

      <div *ngIf="orders.length === 0" class="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <div class="text-4xl mb-4">📦</div>
        <h3 class="text-xl font-bold text-gray-400">No orders found yet.</h3>
        <p class="text-gray-400 mt-2">Start shopping to see your orders here!</p>
      </div>

      <div class="space-y-6">
        <div *ngFor="let order of orders" class="order-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50">
            <div class="flex gap-8">
              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Order Date</p>
                <p class="font-bold text-sm">{{ order.date | date:'mediumDate' }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total</p>
                <p class="font-bold text-sm">{{ order.total | currency }}</p>
              </div>
              <div>
                <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Order ID</p>
                <p class="font-bold text-sm">#{{ order.id.substring(0, 8) }}</p>
              </div>
            </div>
            <div [class]="'status-badge ' + order.status.toLowerCase()">
              {{ order.status }}
            </div>
          </div>
          
          <div class="p-6">
            <div *ngFor="let item of order.items" class="flex gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-gray-50">
              <img [src]="item.product.image" class="w-16 h-16 object-contain bg-gray-50 rounded-xl p-2">
              <div class="flex-1">
                <h4 class="font-bold text-sm">{{ item.product.title }}</h4>
                <p class="text-xs text-gray-500 mt-1">Quantity: {{ item.quantity }} • Price: {{ item.price | currency }}</p>
                <span *ngIf="item.variant" class="inline-block mt-2 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">
                  {{ item.variant }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-badge {
      @apply px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider;
    }
    .status-badge.pending { @apply bg-yellow-100 text-yellow-700; }
    .status-badge.processing { @apply bg-blue-100 text-blue-700; }
    .status-badge.shipped { @apply bg-indigo-100 text-indigo-700; }
    .status-badge.delivered { @apply bg-green-100 text-green-700; }
    .status-badge.cancelled { @apply bg-red-100 text-red-700; }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private http = inject(HttpClient);
  orders: any[] = [];

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/orders`).subscribe(data => {
      this.orders = data;
    });
  }
}
