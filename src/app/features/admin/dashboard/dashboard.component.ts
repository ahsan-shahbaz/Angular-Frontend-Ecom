import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-header mb-12">
      <h1 class="text-4xl font-bold tracking-tight">Dashboard Overview</h1>
      <p class="text-gray-400 mt-2 font-medium">System performance and sales metrics at a glance.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      <!-- Stats Cards -->
      <div *ngFor="let stat of stats" class="stat-card bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
        <div class="flex items-start justify-between mb-6">
          <div [class]="'icon-box w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ' + stat.color">
            {{ stat.icon }}
          </div>
          <span class="text-xs font-bold px-3 py-1 bg-green-50 text-green-600 rounded-full">+{{ stat.trend }}%</span>
        </div>
        <h3 class="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{{ stat.label }}</h3>
        <p class="text-3xl font-bold tracking-tight">{{ stat.value }}</p>
      </div>
    </div>
  `,
  styles: [`
    .icon-box.blue { @apply bg-blue-50 text-blue-600; }
    .icon-box.purple { @apply bg-purple-50 text-purple-600; }
    .icon-box.orange { @apply bg-orange-50 text-orange-600; }
    .icon-box.green { @apply bg-emerald-50 text-emerald-600; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  stats = [
    { label: 'Total Sales', value: '$84,254', icon: '💰', trend: '12.5', color: 'blue' },
    { label: 'Total Orders', value: '1,280', icon: '📦', trend: '8.2', color: 'purple' },
    { label: 'Total Users', value: '4,525', icon: '👤', trend: '15.1', color: 'orange' },
    { label: 'Conversion', value: '2.4%', icon: '📈', trend: '4.3', color: 'green' }
  ];

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/admin/dashboard/stats`).subscribe((data: any) => {
      // Update stats based on real data
    });
  }
}
