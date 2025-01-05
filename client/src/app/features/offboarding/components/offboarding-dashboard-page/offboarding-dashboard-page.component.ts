import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { EmployeesStore } from '../../stores/employees.store';

@Component({
  selector: 'eob-offboarding-dashboard-page',
  imports: [],
  templateUrl: './offboarding-dashboard-page.component.html',
  styleUrl: './offboarding-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingDashboardPageComponent implements OnInit {
  #employeesStore = inject(EmployeesStore);

  employees = this.#employeesStore.employees;

  constructor() {
    // TODO: remove this temporary effect
    effect(() => {
      console.log(this.#employeesStore.employees());
    });
  }

  ngOnInit() {
    this.#employeesStore.loadEmployees();
  }
}
