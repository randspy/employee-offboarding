import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  input,
  OnInit,
} from '@angular/core';
import { EmployeesStore } from '../../stores/employees.store';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OffboardingDialogComponent } from '../offboarding-dialog/offboarding-dialog.component';

@Component({
  selector: 'eob-offboarding-employee-detail-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './offboarding-employee-detail-page.component.html',
  styleUrl: './offboarding-employee-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingEmployeeDetailPageComponent implements OnInit {
  #employeesStore = inject(EmployeesStore);
  #injector = inject(Injector);

  id = input.required<string>();

  isLoading = this.#employeesStore.isLoading;
  isError = this.#employeesStore.isError;
  error = this.#employeesStore.error;

  employee = computed(() =>
    this.#employeesStore.employees().find((e) => e.id === this.id()),
  );

  ngOnInit() {
    this.#employeesStore.loadEmployee(this.id(), {
      injector: this.#injector,
    });
  }

  isAlreadyOffboarded() {
    return this.employee()!.status === 'OFFBOARDED';
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(OffboardingDialogComponent, {
      width: '800px',
      disableClose: true,
      data: {
        id: this.id(),
      },
    });
  }
}
