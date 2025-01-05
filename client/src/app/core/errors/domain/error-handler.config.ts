import { makeEnvironmentProviders } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from '../handlers/global-error.handler';

export const provideErrorHandler = () => {
  return makeEnvironmentProviders([
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ]);
};
