import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OffboardingEmployeeListComponent } from '../offboarding-employee-list/offboarding-employee-list.component';
import { signal, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Employee } from '../../domain/employee.types';
import { EmployeesStore } from '../../stores/employees.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'eob-offboarding-dashboard-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    OffboardingEmployeeListComponent,
  ],
  templateUrl: './offboarding-dashboard-page.component.html',
  styleUrl: './offboarding-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingDashboardPageComponent implements OnInit {
  #employeesStore = inject(EmployeesStore);

  filter = signal('');

  #debouncedFilter = toSignal(
    toObservable(this.filter).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  filteredEmployees = computed(() =>
    this.#filterEmployees(
      this.#employeesStore.employees(),
      this.#debouncedFilter(),
    ),
  );

  ngOnInit() {
    this.#employeesStore.loadEmployees();
  }

  #filterEmployees(employees: Employee[], filter: string) {
    if (!filter) {
      return employees;
    }
    return employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(filter.toLowerCase()) ||
        employee.department.toLowerCase().includes(filter.toLowerCase())
      );
    });
  }
}
