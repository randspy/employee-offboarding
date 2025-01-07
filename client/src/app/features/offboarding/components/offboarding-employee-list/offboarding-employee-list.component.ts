import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Employee, Equipment } from '../../domain/employee.types';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'eob-offboarding-employee-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './offboarding-employee-list.component.html',
  styleUrl: './offboarding-employee-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingEmployeeListComponent implements OnInit {
  employees = input.required<Employee[]>();

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

  constructor() {
    effect(() => {
      this.dataSource.data = this.employees();
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator();
  }

  getEquipmentNames(equipments: Equipment[]) {
    return equipments.map((equipment) => equipment.name).join(', ');
  }
}
