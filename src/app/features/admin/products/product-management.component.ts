import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-4xl font-bold tracking-tight">Product Management</h1>
        <p class="text-gray-400 mt-2 font-medium">Manage your inventory and product listings.</p>
      </div>
      <button class="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
        + Add New Product
      </button>
    </div>

    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50/50">
          <tr>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
            <th class="px-12 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
            <th class="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr *ngFor="let product of products" class="hover:bg-gray-50/30 transition-colors">
            <td class="px-8 py-6">
              <div class="flex items-center gap-4">
                <img [src]="product.image" class="w-12 h-12 rounded-xl object-contain bg-gray-50 p-2">
                <span class="font-bold text-sm">{{ product.title }}</span>
              </div>
            </td>
            <td class="px-8 py-6 text-sm text-gray-500 font-medium">{{ product.category }}</td>
            <td class="px-8 py-6 text-sm font-bold tracking-tight">{{ product.price | currency }}</td>
            <td class="px-8 py-6">
              <span class="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    [class]="product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                {{ product.stock > 0 ? product.stock + ' In Stock' : 'Out of Stock' }}
              </span>
            </td>
            <td class="px-8 py-6">
              <div class="flex gap-4">
                <button class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">✏️</button>
                <button class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ProductManagementComponent implements OnInit {
  private http = inject(HttpClient);
  products: any[] = [];

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe(data => {
      this.products = data;
    });
  }
}
