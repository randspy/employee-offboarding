import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { EmployeesStore } from '../../stores/employees.store';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { OffboardDialogComponent } from '../offboard-dialog/offboard-dialog.component';

@Component({
  selector: 'eob-offboarding-employee-detail-page',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './offboarding-employee-detail-page.component.html',
  styleUrl: './offboarding-employee-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingEmployeeDetailPageComponent implements OnInit {
  #employeesStore = inject(EmployeesStore);

  id = input.required<string>();

  isLoading = this.#employeesStore.isLoading;
  isError = this.#employeesStore.isError;
  error = this.#employeesStore.error;

  employee = computed(() =>
    this.#employeesStore.employees().find((e) => e.id === this.id()),
  );

  ngOnInit() {
    this.#employeesStore.loadEmployee(this.id);
  }

  isAlreadyOffboarded() {
    return this.employee()!.status === 'OFFBOARDED';
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(OffboardDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
