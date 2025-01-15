import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { OffboardingEmployeeDetailPageComponent } from './offboarding-employee-detail-page.component';
import { EmployeesStore } from '../../stores/employees.store';

import { Employee } from '../../domain/employee.types';
import { generateEmployee } from '../../../../../tests/test-object-generators';
import { DummyComponent } from '../../../../../tests/dummy-component';
import { RouterTestingHarness } from '@angular/router/testing';
import { userEvent } from '@testing-library/user-event';
import { provideMockNotificationService } from '../../../../../tests/mock-notification-service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { screen, waitFor } from '@testing-library/angular';
import { EmployeeService } from '../../services/employee.service';

async function setup() {
  TestBed.configureTestingModule({
    imports: [OffboardingEmployeeDetailPageComponent],
    providers: [
      provideMockNotificationService(),
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter(
        [
          {
            path: 'offboarding',
            component: DummyComponent,
          },
          {
            path: 'offboarding/:id',
            component: OffboardingEmployeeDetailPageComponent,
          },
        ],
        withComponentInputBinding(),
      ),
      EmployeesStore,
      EmployeeService,
    ],
  });

  const harness = await RouterTestingHarness.create();
  harness.fixture.autoDetectChanges(true);

  await harness.navigateByUrl(
    '/offboarding/employee-1',
    OffboardingEmployeeDetailPageComponent,
  );

  const user = userEvent.setup();
  const httpCtrl = TestBed.inject(HttpTestingController);

  return {
    user,
    httpCtrl,
    harness,
  };
}

describe('OffboardingEmployeeDetailPageComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display employee', async () => {
    const { httpCtrl } = await setup();

    await mockHttpCall(httpCtrl);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeVisible();
      expect(screen.getByText('John Doe', { selector: 'p' })).toBeTruthy();
      expect(screen.getByText('john.doe@example.com')).toBeVisible();
      expect(screen.getByText('Department 1')).toBeVisible();
      expect(screen.getByText('Equipment 1')).toBeVisible();
      expect(screen.getByText('Equipment 2')).toBeVisible();
    });
  });

  it('should display no employee', async () => {
    const { httpCtrl } = await setup();

    await mockHttpCall(
      httpCtrl,
      generateEmployee({
        id: 'employee-2',
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('No employee found')).toBeVisible();
    });
  });

  it('should display loading state', async () => {
    await setup();

    await waitFor(() => {
      expect(
        screen.getByTestId('offboarding-employee-detail-page-loader'),
      ).toBeVisible();
    });
  });

  it('should should go back to dashboard', async () => {
    const { user, httpCtrl, harness } = await setup();

    await mockHttpCall(httpCtrl);

    const backButton = screen.getByRole('link', {
      name: /Back/,
    });

    await user.click(backButton);

    await waitFor(() => {
      expect(harness.routeDebugElement!.componentInstance).toBeInstanceOf(
        DummyComponent,
      );
    });
  });

  it('should open offboard dialog', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const { user, httpCtrl } = await setup();

    await mockHttpCall(httpCtrl);

    const offboardButton = await screen.findByRole('button', {
      name: 'Offboard',
    });

    await user.click(offboardButton);

    expect(screen.getByRole('dialog')).toBeVisible();
  });

  const mockHttpCall = async (
    httpCtrl: HttpTestingController,
    employee: Employee = generateEmployee({
      id: 'employee-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Department 1',
      equipments: [
        {
          id: 'equipment-1',
          name: 'Equipment 1',
        },
        {
          id: 'equipment-2',
          name: 'Equipment 2',
        },
      ],
    }),
  ) => {
    await waitFor(() => {
      httpCtrl.expectOne('/api/employees/employee-1').flush(employee);

      httpCtrl.verify();
    });
  };
});
