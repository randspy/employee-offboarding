import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  #logger = inject(LoggerService);

  handleError(error: unknown) {
    if (error instanceof Error) {
      this.#logger.error(error);
    } else {
      this.#logger.error(this.#getErrorMessage(error));
    }
  }

  #getErrorMessage(error: unknown): string {
    try {
      if (error === null) return 'Null error';
      if (error === undefined) return 'Undefined error';

      if (typeof error === 'object') {
        return Object.getOwnPropertyNames(error)
          .map((key) => `${key}: ${(error as Record<string, unknown>)[key]}`)
          .join(', ');
      }

      return String(error);
    } catch {
      return 'Error could not be stringified';
    }
  }
}
