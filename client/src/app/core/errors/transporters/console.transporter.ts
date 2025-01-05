import { LogLevel } from '../domain/logger.types';
import { ITransporter } from '../domain/logger.types';

export class ConsoleTransporter<T> implements ITransporter<T> {
  log(payload: T, level: LogLevel) {
    switch (level) {
      case 'INFO':
        return console.info(payload);
      case 'DEBUG':
        return console.debug(payload);
      case 'WARN':
        return console.warn(payload);
      case 'ERROR':
        return console.error(payload);
    }
  }
}
