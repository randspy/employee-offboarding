import { inject, Injectable } from '@angular/core';
import { Employee } from '../domain/employee.types';
import { patchState, signalState } from '@ngrx/signals';
import { exhaustMap, tap } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { EMPTY } from 'rxjs';

import { NotificationService } from '../../../core/shared/services/notification.service';

interface EmployeesState {
  employees: Employee[];
  isLoading: boolean;
  isCached: boolean;
  isError: boolean;
  error: string;
}

const initialState: EmployeesState = {
  employees: [],
  isLoading: false,
  isCached: false,
  isError: false,
  error: '',
};

@Injectable()
export class EmployeesStore {
  #employeeService = inject(EmployeeService);
  #notificationService = inject(NotificationService);

  #state = signalState(initialState);

  readonly employees = this.#state.employees;
  readonly isLoading = this.#state.isLoading;
  readonly isError = this.#state.isError;
  readonly error = this.#state.error;

  loadEmployees = rxMethod<void>(
    pipe(
      tap(() => this.#startLoading()),
      exhaustMap(() => {
        if (this.#state.isCached()) {
          return EMPTY;
        }

        return this.#employeeService.getEmployees().pipe(
          tapResponse({
            next: (employees) => {
              patchState(this.#state, {
                employees:
                  this.#addEmployeesWithoutOverridingTheExistingOnes(employees),
                isCached: true,
              });
            },
            error: (error: Error) => {
              const failedToLoadEmployeesMessage = 'Failed to load employees';

              this.#notificationService.showError(
                error,
                failedToLoadEmployeesMessage,
              );

              patchState(this.#state, {
                isError: true,
                error: failedToLoadEmployeesMessage,
              });
            },
            finalize: () => this.#stopLoading(),
          }),
        );
      }),
    ),
  );

  #addEmployeesWithoutOverridingTheExistingOnes(employees: Employee[]) {
    return employees.map((employee) => {
      const existingEmployee = this.#state
        .employees()
        .find((e) => e.id === employee.id);
      return existingEmployee || employee;
    });
  }

  #startLoading() {
    if (this.#state.isCached()) {
      return;
    }

    patchState(this.#state, { isLoading: true, isError: false, error: '' });
  }

  #stopLoading() {
    patchState(this.#state, { isLoading: false });
  }

  loadEmployee = rxMethod<string>(
    pipe(
      tap(() => this.#startLoading()),
      exhaustMap((id) => {
        if (this.#state.isCached()) {
          return EMPTY;
        }

        return this.#employeeService.getEmployee(id).pipe(
          tapResponse({
            next: (employee) =>
              patchState(this.#state, { employees: [employee] }),
            error: (error: Error) => {
              const failedToLoadEmployeeMessage = 'Failed to load employee';

              this.#notificationService.showError(
                error,
                failedToLoadEmployeeMessage,
              );

              patchState(this.#state, {
                isError: true,
                error: failedToLoadEmployeeMessage,
              });
            },
            finalize: () => this.#stopLoading(),
          }),
        );
      }),
    ),
  );

  offboardEmployee(id: string) {
    patchState(this.#state, {
      employees: this.#state
        .employees()
        .map((employee) =>
          employee.id === id
            ? { ...employee, status: 'OFFBOARDED' as const }
            : employee,
        ),
    });
  }
}
