import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'eob-offboard-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './offboard-dialog.component.html',
  styleUrl: './offboard-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardDialogComponent {
  #formBuilder = inject(FormBuilder);
  #phoneValidatorForPoland = new RegExp(/^(?:\+48|48)?(?:[ -]?\d{3}){3}$/);
  #postalCodeValidatorForPoland = new RegExp(/^\d{2}-\d{3}$/);

  form = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.required, Validators.pattern(this.#phoneValidatorForPoland)],
    ],
    address: this.#formBuilder.group({
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
    }),
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
