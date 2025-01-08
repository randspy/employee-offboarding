import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
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
  templateUrl: './offboarding-dialog.component.html',
  styleUrl: './offboarding-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingDialogComponent {
  #injector = inject(Injector);
  #dialogRef = inject(MatDialogRef<OffboardingDialogComponent>);
  #data = inject(MAT_DIALOG_DATA) as { id: string };
  #usersStore = inject(UsersStore);

  offboardingForm = viewChild.required<OffboardingFormComponent>(
    OffboardingFormComponent,
  );

  readonly isLoading = this.#usersStore.isLoading;
  readonly isError = this.#usersStore.isError;
  readonly error = this.#usersStore.error;

  hasSubmitted = signal(false);

  constructor() {
    effect(() => {
      if (
        this.hasSubmitted() &&
        !this.#usersStore.isLoading() &&
        !this.#usersStore.isError()
      ) {
        this.#dialogRef.close(true);
      }

      if (this.#usersStore.isError()) {
        this.hasSubmitted.set(false);
      }
    });
  }

  onSubmit() {
    const offboarding: Offboarding = {
      address: {
        receiver: this.offboardingForm().form.value.receiver!,
        country: this.offboardingForm().form.value.country!,
        city: this.offboardingForm().form.value.city!,
        streetLine1: this.offboardingForm().form.value.streetLine1!,
        postalCode: this.offboardingForm().form.value.postalCode!,
      },
      email: this.offboardingForm().form.value.email!,
      phone: this.offboardingForm().form.value.phone!,
      notes: this.offboardingForm().form.value.notes!,
    };

    this.hasSubmitted.set(true);
    this.#usersStore.offboardEmployee(
      {
        id: this.#data.id,
        offboarding,
      },
      {
        injector: this.#injector,
      },
    );
  }
}
