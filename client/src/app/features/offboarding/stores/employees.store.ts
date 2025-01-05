import { inject, Injectable } from '@angular/core';
import { Employee } from '../domain/employee.types';
import { patchState, signalState } from '@ngrx/signals';
import { exhaustMap, tap } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { EMPTY } from 'rxjs';

interface EmployeesState {
  employees: Employee[];
  isLoading: boolean;
  isCached: boolean;
}

const initialState: EmployeesState = {
  employees: [],
  isLoading: false,
  isCached: false,
};

@Injectable()
export class EmployeesStore {
  #employeeService = inject(EmployeeService);
  #state = signalState(initialState);

  readonly employees = this.#state.employees;
  readonly isLoading = this.#state.isLoading;

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
            error: () => {
              // TODO: handle error
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
    patchState(this.#state, { isLoading: true });
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
            error: () => {
              // TODO: handle error
            },
            finalize: () => this.#stopLoading(),
          }),
        );
      }),
    ),
  );
}
