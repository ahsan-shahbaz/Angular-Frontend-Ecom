import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="message">
      <div class="toast" [ngClass]="message.type">
        <span>{{ message.message }}</span>
        <button class="close-btn" (click)="message = null">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .toast {
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    }
    .success { background-color: #10b981; }
    .error { background-color: #ef4444; }
    .info { background-color: #3b82f6; }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  message: ToastMessage | null = null;

  ngOnInit() {
    this.toastService.toast$.subscribe(msg => {
      this.message = msg;
      setTimeout(() => this.message = null, 3000);
    });
  }
}
