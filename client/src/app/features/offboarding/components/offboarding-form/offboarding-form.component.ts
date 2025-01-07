import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'eob-offboarding-form',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './offboarding-form.component.html',
  styleUrl: './offboarding-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingFormComponent {
  #formBuilder = inject(FormBuilder);
  #phoneValidatorForPoland = new RegExp(/^(?:\+48|48)?(?:[ -]?\d{3}){3}$/);
  #postalCodeValidatorForPoland = new RegExp(/^\d{2}-\d{3}$/);

  form = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.required, Validators.pattern(this.#phoneValidatorForPoland)],
    ],
    receiver: ['', [Validators.required]],
    country: ['', [Validators.required]],
    city: ['', [Validators.required]],
    streetLine1: ['', [Validators.required]],
    postalCode: [
      '',
      [
        Validators.required,
        Validators.pattern(this.#postalCodeValidatorForPoland),
      ],
    ],
    notes: [''],
  });

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.#getFieldControl(fieldName)!;
    return (
      (control.errors?.[errorType] && (control.touched || control.dirty)) ??
      false
    );
  }

  #getFieldControl(fieldName: string): AbstractControl | null {
    return this.form.get(fieldName);
  }
}
