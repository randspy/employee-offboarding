import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoggerService } from '../../errors/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  #logger = inject(LoggerService);
  #toastr = inject(ToastrService);

  showError(error: Error, message?: string) {
    this.#toastr.error(message ?? error.message, 'Error');
    this.#logger.error(error.message);
  }
}
