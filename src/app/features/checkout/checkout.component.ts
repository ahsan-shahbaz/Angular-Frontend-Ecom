import { Component, ChangeDetectionStrategy, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { ToastService } from '../../core/services/toast.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>
      
      <div class="content grid-cols-2">
        <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="form-section">
          <h3>Shipping Information</h3>
          
          <div class="grid-2">
            <app-input
              formControlName="firstName"
              label="First Name"
              [hasError]="isFieldInvalid('firstName')"
              errorMessage="First name is required">
            </app-input>
            
            <app-input
              formControlName="lastName"
              label="Last Name"
              [hasError]="isFieldInvalid('lastName')"
              errorMessage="Last name is required">
            </app-input>
          </div>

          <app-input
            formControlName="address"
            label="Address"
            [hasError]="isFieldInvalid('address')"
            errorMessage="Address is required">
          </app-input>

          <div class="grid-2">
            <app-input
              formControlName="city"
              label="City"
              [hasError]="isFieldInvalid('city')"
              errorMessage="City is required">
            </app-input>
            
            <app-input
              formControlName="zipCode"
              label="ZIP Code"
              [hasError]="isFieldInvalid('zipCode')"
              errorMessage="ZIP code is required">
            </app-input>
          </div>

          <h3>Payment Details</h3>
          <app-input
            formControlName="cardNumber"
            label="Card Number"
            [hasError]="isFieldInvalid('cardNumber')"
            errorMessage="Valid 16-digit card number is required">
          </app-input>

          <app-button 
            type="submit" 
            variant="primary" 
            size="lg" 
            [disabled]="checkoutForm.invalid || isSubmitting"
            [loading]="isSubmitting"
            class="submit-btn">
            Place Order
          </app-button>
        </form>

        <div class="summary-section">
          <h3>Order Summary</h3>
          <div *ngIf="vm$ | async as vm" class="summary-card">
            <div class="summary-item" *ngFor="let item of vm.items">
              <span class="item-title">{{ item.quantity }}x {{ item.product.title | slice:0:20 }}...</span>
              <span>\${{ item.product.price * item.quantity | number:'1.2-2' }}</span>
            </div>
            <div class="divider"></div>
            <div class="summary-total">
              <strong>Total</strong>
              <strong>\${{ vm.totalPrice | number:'1.2-2' }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container { max-width: 900px; margin: 0 auto; }
    h2 { margin-bottom: 2rem; color: var(--text-color, #1f2937); }
    h3 { margin-bottom: 1.5rem; color: var(--text-color, #374151); margin-top: 1rem; }
    
    .grid-cols-2 {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-section { display: flex; flex-direction: column; }
    .submit-btn { margin-top: 2rem; width: 100%; }
    
    .summary-card {
      background: var(--card-bg, #f9fafb);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--border-color, #e5e7eb);
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      color: var(--text-color, #4b5563);
    }
    .divider { height: 1px; background: var(--border-color, #e5e7eb); margin: 1rem 0; }
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.25rem;
      color: var(--text-color, #1f2937);
    }

    :host-context(.dark-theme) {
      --text-color: #f9fafb;
      --card-bg: #1f2937;
      --border-color: #374151;
    }

    @media (max-width: 768px) {
      .grid-cols-2 { grid-template-columns: 1fr; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private orderService = inject(OrderService);

  checkoutForm!: FormGroup;
  isSubmitting = false;

  vm$ = this.cartService.cartState$;

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.checkoutForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.orderService.placeOrder(this.checkoutForm.value).subscribe({
      next: (order) => {
        this.toastService.success('Order placed successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/']);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastService.error('Failed to place order. Please try again.');
        this.isSubmitting = false;
        console.error('Order error:', err);
      }
    });
  }
}
