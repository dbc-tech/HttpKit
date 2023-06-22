import winston from 'winston';
import * as Transport from 'winston-transport';

export type WinstonLoggerOptions = {
  level?: string;
  meta?: Record<string, unknown>;
  extraTransports?: Transport[];
};

export function getWinstonLogger(options?: WinstonLoggerOptions) {
  const level = options?.level || 'info';
  const defaultMeta = options?.meta || { context: 'http-service' };
  const extraTransports = options?.extraTransports || [];

  const logger = winston.createLogger({
    level,
    defaultMeta,
    transports: [new winston.transports.Console(), ...extraTransports],
  });

  return logger;
}
