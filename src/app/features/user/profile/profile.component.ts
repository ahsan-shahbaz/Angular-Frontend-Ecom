import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-profile max-w-2xl mx-auto py-12">
      <h1 class="text-3xl font-bold mb-8">My Profile</h1>
      
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div class="flex items-center gap-6 mb-8">
          <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold">
            {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
          </div>
          <div>
            <h2 class="text-xl font-bold">{{ user?.firstName }} {{ user?.lastName }}</h2>
            <p class="text-gray-500">{{ user?.email }}</p>
            <span class="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wider text-gray-500">
              {{ user?.role }} Account
            </span>
          </div>
        </div>

        <form class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input type="text" [value]="user?.firstName" class="form-input">
            </div>
            <div class="form-group">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input type="text" [value]="user?.lastName" class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input type="email" [value]="user?.email" disabled class="form-input bg-gray-50">
          </div>

          <div class="flex justify-end pt-4">
            <button type="button" class="btn btn-primary px-8 py-3 rounded-2xl font-bold">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-input {
      @apply w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all;
    }
  `]
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUserValue;
}
