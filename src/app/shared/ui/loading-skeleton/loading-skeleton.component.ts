import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-container">
      <div class="skeleton img"></div>
      <div class="skeleton title"></div>
      <div class="skeleton price"></div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }
    .img { height: 200px; width: 100%; }
    .title { height: 20px; width: 80%; }
    .price { height: 20px; width: 40%; }
    
    :host-context(.dark-theme) .skeleton {
      background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
      background-size: 200% 100%;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSkeletonComponent {}
