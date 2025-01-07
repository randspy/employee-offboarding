import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OffboardingApiResponse, Offboarding } from '../domain/offboard.types';

@Injectable()
export class UserService {
  #http = inject(HttpClient);

  offboardEmployee(id: string, offboarding: Offboarding) {
    return this.#http.post<OffboardingApiResponse>(
      `/api/users/${id}/offboard`,
      offboarding,
    );
  }
}
