import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EmployeesStore } from '../../stores/employees.store';
import { Employee, Equipment } from '../../domain/employee.types';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { LinkComponent } from '../../../../ui/components/link/link.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'eob-offboarding-employee-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    LinkComponent,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './offboarding-employee-list.component.html',
  styleUrl: './offboarding-employee-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingEmployeeListComponent implements OnInit {
  #employeesStore = inject(EmployeesStore);

  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'equipment',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Employee>([]);
  paginator = viewChild.required(MatPaginator);
  filter = signal('');

  #debouncedFilter = toSignal(
    toObservable(this.filter).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  constructor() {
    effect(() => {
      this.dataSource.data = this.#filterEmployees(
        this.#employeesStore.employees(),
        this.#debouncedFilter(),
      );
    });
  }

  ngOnInit() {
    this.#employeesStore.loadEmployees();
    this.dataSource.paginator = this.paginator();
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

  getEquipmentNames(equipments: Equipment[]) {
    return equipments.map((equipment) => equipment.name).join(', ');
  }
}
