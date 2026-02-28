import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Hint: login with test&#64;test.com / password</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <app-input
            formControlName="email"
            type="email"
            label="Email Address"
            [hasError]="isFieldInvalid('email')"
            errorMessage="Valid email is required">
          </app-input>

          <app-input
            formControlName="password"
            type="password"
            label="Password"
            [hasError]="isFieldInvalid('password')"
            errorMessage="Password is required">
          </app-input>

          <app-button 
            type="submit" 
            variant="primary" 
            [disabled]="loginForm.invalid || loading" 
            [loading]="loading"
            class="w-100">
            Sign In
          </app-button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      background: var(--card-bg, white);
      border: 1px solid var(--border-color, #f3f4f6);
    }
    h2 { margin: 0 0 0.5rem 0; text-align: center; color: var(--text-color, #1f2937); }
    .subtitle { text-align: center; color: #6b7280; margin-bottom: 2rem; font-size: 0.875rem; }
    
    .w-100 { display: block; width: 100%; margin-top: 1.5rem; }
    ::ng-deep .w-100 button { width: 100%; }

    :host-context(.dark-theme) {
      --card-bg: #1f2937;
      --border-color: #374151;
      --text-color: #f9fafb;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  loading = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email]],
      password: ['password', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
