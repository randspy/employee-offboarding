import { inject, Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { Offboarding } from '../domain/offboard.types';
import { UserService } from '../services/user.service';
import { LoggerService } from '../../../core/errors/services/logger.service';
import { EmployeesStore } from './employees.store';

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
  #logger = inject(LoggerService);

  readonly isLoading = this.#state.isLoading;
  readonly isError = this.#state.isError;
  readonly error = this.#state.error;

  offboardEmployee = rxMethod<{ id: string; offboarding: Offboarding }>(
    pipe(
      tap(() => patchState(this.#state, { isLoading: true })),
      exhaustMap(({ id, offboarding }) =>
        this.#userService.offboardEmployee(id, offboarding).pipe(
          tapResponse({
            next: () => {
              patchState(this.#state, { isLoading: false });
              this.#employeesStore.offboardEmployee(id);
            },
            error: (error: Error) => {
              this.#logger.error(error);

              patchState(this.#state, {
                isError: true,
                isLoading: false,
                error: 'Failed to offboard employee',
              });
            },
          }),
        ),
      ),
    ),
  );
}
