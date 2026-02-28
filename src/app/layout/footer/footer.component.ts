import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p>&copy; 2024 StorePOC. Developed by a Senior Angular Architect.</p>
    </footer>
  `,
  styles: [`
    .footer {
      text-align: center;
      padding: 2rem;
      background: var(--footer-bg, #f3f4f6);
      color: var(--text-color, #6b7280);
      margin-top: auto;
    }
    
    :host-context(.dark-theme) .footer {
      --footer-bg: #111827;
      --text-color: #9ca3af;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
