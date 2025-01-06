import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OffboardingEmployeeListComponent } from '../offboarding-employee-list/offboarding-employee-list.component';
@Component({
  selector: 'eob-offboarding-dashboard-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    OffboardingEmployeeListComponent,
  ],
  templateUrl: './offboarding-dashboard-page.component.html',
  styleUrl: './offboarding-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingDashboardPageComponent {}
