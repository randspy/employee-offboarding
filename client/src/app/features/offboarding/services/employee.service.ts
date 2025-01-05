import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../domain/employee.types';

@Injectable()
export class EmployeeService {
  #http = inject(HttpClient);

  getEmployee(id: string) {
    return this.#http.get<Employee>(`/api/employees/${id}`);
  }

  getEmployees() {
    return this.#http.get<Employee[]>('/api/employees');
  }
}
