import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="input-group">
      <label *ngIf="label" [for]="id" class="label">{{ label }}</label>
      <input
        [type]="type"
        [id]="id"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        class="input"
        [class.error]="hasError"
      />
      <small class="error-text" *ngIf="hasError">{{ errorMessage }}</small>
    </div>
  `,
  styles: [`
    .input-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }
    .label {
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
      color: var(--text-color, #374151);
    }
    .input {
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border: 1px solid var(--border-color, #d1d5db);
      border-radius: 6px;
      outline: none;
      transition: border-color 0.2s;
      background: var(--input-bg, #ffffff);
      color: var(--text-color, #1f2937);
    }
    .input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .input.error {
      border-color: #ef4444;
    }
    .error-text {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    :host-context(.dark-theme) {
      --border-color: #4b5563;
      --input-bg: #374151;
      --text-color: #f9fafb;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id = Math.random().toString(36).substring(7);
  @Input() hasError = false;
  @Input() errorMessage = '';
  
  value: string = '';
  disabled: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
}
