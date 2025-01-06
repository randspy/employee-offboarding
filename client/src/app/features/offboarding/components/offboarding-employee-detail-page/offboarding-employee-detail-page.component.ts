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
  employee = computed(() =>
    this.#employeesStore.employees().find((e) => e.id === this.id()),
  );

  ngOnInit() {
    this.#employeesStore.loadEmployee(this.id);
  }

  isAlreadyOffboarded() {
    return this.employee()!.status === 'OFFBOARDED';
  }
}
