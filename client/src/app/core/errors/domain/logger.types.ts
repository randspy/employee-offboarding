import { HttpErrorResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export type LogTypes = string | Error | HttpErrorResponse;

export type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';

export interface CapturedPayload {
  payload: LogTypes;
  level: LogLevel;
  timestamp: Date;
}

export interface ITransporter<T> {
  log(payload: T, level: LogLevel): void;
}

export const LOGGER_TRANSPORTER = new InjectionToken<
  ITransporter<CapturedPayload>
>('LOGGER_TRANSPORTER');

export interface ILoggerService {
  info(message: LogTypes): void;
  debug(message: LogTypes): void;
  warn(message: LogTypes): void;
  error(message: LogTypes): void;
}
