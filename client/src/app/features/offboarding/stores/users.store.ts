import { inject, Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { Offboarding } from '../domain/offboard.types';
import { UserService } from '../services/user.service';
import { EmployeesStore } from './employees.store';
import { NotificationService } from '../../../core/shared/services/notification.service';

interface UsersState {
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const initialState: UsersState = {
  isLoading: false,
  isError: false,
  error: '',
};

@Injectable()
export class UsersStore {
  #employeesStore = inject(EmployeesStore);
  #state = signalState(initialState);
  #userService = inject(UserService);
  #notificationService = inject(NotificationService);

  readonly isLoading = this.#state.isLoading;
  readonly isError = this.#state.isError;
  readonly error = this.#state.error;

  offboardEmployee = rxMethod<{ id: string; offboarding: Offboarding }>(
    pipe(
      tap(() =>
        patchState(this.#state, {
          isLoading: true,
          isError: false,
          error: '',
        }),
      ),
      exhaustMap(({ id, offboarding }) =>
        this.#userService.offboardEmployee(id, offboarding).pipe(
          tapResponse({
            next: () => {
              patchState(this.#state, { isLoading: false });
              this.#employeesStore.offboardEmployee(id);
            },
            error: (error: Error) => {
              const failedToOffboardMessage = 'Failed to offboard employee';
              this.#notificationService.showError(
                error,
                failedToOffboardMessage,
              );

              patchState(this.#state, {
                isError: true,
                isLoading: false,
                error: failedToOffboardMessage,
              });
            },
          }),
        ),
      ),
    ),
  );
}
