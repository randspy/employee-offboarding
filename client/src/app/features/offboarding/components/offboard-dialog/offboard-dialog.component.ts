import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Offboarding } from '../../domain/offboard.types';
import { UsersStore } from '../../stores/users.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'eob-offboard-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './offboard-dialog.component.html',
  styleUrl: './offboard-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardDialogComponent {
  #formBuilder = inject(FormBuilder);
  #dialogRef = inject(MatDialogRef<OffboardDialogComponent>);
  #data = inject(MAT_DIALOG_DATA) as { id: string };
  #usersStore = inject(UsersStore);

  readonly isLoading = this.#usersStore.isLoading;
  readonly isError = this.#usersStore.isError;
  readonly error = this.#usersStore.error;

  #hasSubmitted = signal(false);

  #phoneValidatorForPoland = new RegExp(/^(?:\+48|48)?(?:[ -]?\d{3}){3}$/);
  #postalCodeValidatorForPoland = new RegExp(/^\d{2}-\d{3}$/);

  constructor() {
    effect(() => {
      if (
        this.#hasSubmitted() &&
        !this.#usersStore.isLoading() &&
        !this.#usersStore.isError()
      ) {
        this.#dialogRef.close(true);
      }
    });
  }

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

  onSubmit() {
    this.#usersStore.offboardEmployee({
      id: this.#data.id,
      offboarding: this.form.value as Offboarding,
    });

    this.#hasSubmitted.set(true);
  }
}
