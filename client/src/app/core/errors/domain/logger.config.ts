import { makeEnvironmentProviders } from '@angular/core';
import { LOGGER_TRANSPORTER } from './logger.types';
import { ConsoleTransporter } from '../transporters/console.transporter';

export const provideLogger = () => {
  return makeEnvironmentProviders([
    {
      provide: LOGGER_TRANSPORTER,
      useClass: ConsoleTransporter,
    },
  ]);
};
