import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent],
  template: `
    <!-- Global application layout and router outlet -->
    <router-outlet></router-outlet>
    <!-- Global toast notification container -->
    <app-toast></app-toast>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Initialize theme based on user preference or local storage
    this.themeService.initTheme();
  }
}
