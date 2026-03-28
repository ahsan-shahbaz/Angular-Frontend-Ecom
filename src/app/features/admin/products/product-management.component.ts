import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold">Product Management</h1>
          <p class="text-gray-500 mt-1">Manage your store's items and inventory</p>
        </div>
        <button class="btn btn-primary px-6 py-3 rounded-2xl flex items-center gap-2">
          <i class="ri-add-line"></i>
          <span>Add New Product</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th class="px-6 py-4">Product</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Price</th>
                <th class="px-6 py-4">Stock</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let product of products" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <img [src]="product.image" class="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1">
                    <div>
                      <div class="text-sm font-bold">{{ product.title }}</div>
                      <div class="text-xs text-gray-400">{{ product.brand || 'No Brand' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-bold">{{ product.price | currency }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div [class]="'w-2 h-2 rounded-full ' + (product.stock > 10 ? 'bg-green-500' : 'bg-red-500')"></div>
                    <span class="text-sm text-gray-600 font-medium">{{ product.stock }} items</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button class="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"><i class="ri-pencil-line text-lg"></i></button>
                    <button class="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"><i class="ri-delete-bin-line text-lg"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
