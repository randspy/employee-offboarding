import { Employee } from '../app/features/offboarding/domain/employee.types';
import { Offboarding } from '../app/features/offboarding/domain/offboard.types';

export function generateEmployee(employee: Partial<Employee>): Employee {
  return {
    id: 'test-uuid',
    name: 'test-employee',
    department: 'test-department',
    status: 'ACTIVE',
    email: 'test-email',
    equipments: [],
    ...employee,
  };
}

export function generateOffboarding(
  offboarding: Partial<Offboarding>,
): Offboarding {
  return {
    address: {
      streetLine1: 'test-street',
      country: 'test-country',
      postalCode: 'test-postal-code',
      receiver: 'test-receiver',
    },
    notes: 'test-notes',
    phone: 'test-phone',
    email: 'test-email',
    ...offboarding,
  };
}
