import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="'btn ' + variant + ' ' + size"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)">
      <span *ngIf="loading" class="spinner"></span>
      <ng-content *ngIf="!loading"></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
       transition: all 0.2s;
    }
    .primary { background: #3b82f6; color: white; }
    .primary:hover:not(:disabled) { background: #2563eb; }
    .secondary { background: #e5e7eb; color: #374151; }
    .secondary:hover:not(:disabled) { background: #d1d5db; }
    .danger { background: #ef4444; color: white; }
    .sm { padding: 6px 12px; font-size: 0.875rem; }
    .md { padding: 8px 16px; font-size: 1rem; }
    .lg { padding: 12px 24px; font-size: 1.125rem; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() onClick = new EventEmitter<Event>();
}
