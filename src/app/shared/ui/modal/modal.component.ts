import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" (click)="close()">&times;</button>
        </header>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <footer class="modal-footer" *ngIf="showFooter">
          <ng-content select="[modal-footer]"></ng-content>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }
    .modal {
      background: var(--card-bg, white);
      min-width: 400px;
      max-width: 90%;
      border-radius: 8px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
      animation: slideUp 0.3s;
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 { margin: 0; font-size: 1.125rem; color: var(--text-color, #1f2937); }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; }
    .modal-body { padding: 1.5rem; color: var(--text-color, #4b5563); }
    .modal-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--border-color, #e5e7eb);
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    :host-context(.dark-theme) .modal {
      --card-bg: #1f2937;
      --border-color: #374151;
      --text-color: #f9fafb;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.closeEvent.emit();
  }
}
