import { Employee } from '../app/features/offboarding/domain/employee.types';

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
