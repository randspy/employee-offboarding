import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { OffboardingFormComponent } from '../offboarding-form/offboarding-form.component';

@Component({
  selector: 'eob-offboard-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    OffboardingFormComponent,
  ],
  templateUrl: './offboard-dialog.component.html',
  styleUrl: './offboard-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardDialogComponent {
  #dialogRef = inject(MatDialogRef<OffboardDialogComponent>);
  #data = inject(MAT_DIALOG_DATA) as { id: string };
  #usersStore = inject(UsersStore);

  offboardingForm = viewChild.required<OffboardingFormComponent>(
    OffboardingFormComponent,
  );

  readonly isLoading = this.#usersStore.isLoading;
  readonly isError = this.#usersStore.isError;
  readonly error = this.#usersStore.error;

  #hasSubmitted = signal(false);

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

  onSubmit() {
    this.#usersStore.offboardEmployee({
      id: this.#data.id,
      offboarding: this.offboardingForm().form.value as Offboarding,
    });

    this.#hasSubmitted.set(true);
  }
}
