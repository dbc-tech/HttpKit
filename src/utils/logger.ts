import winston from 'winston';
import * as Transport from 'winston-transport';

export type WinstonLoggerOptions = {
  level?: string;
  meta?: Record<string, unknown>;
  extraTransports?: Transport[];
};

export function getWinstonLogger(options?: WinstonLoggerOptions) {
  const level = options?.level || 'info';
  const extraTransports = options?.extraTransports || [];

  const logger = winston.createLogger({
    level,
    defaultMeta: options?.meta,
    transports: [new winston.transports.Console(), ...extraTransports],
  });

  return logger;
}
