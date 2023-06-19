import winston from 'winston';

export type WinstonLoggerOptions = {
  level?: string;
  meta?: Record<string, unknown>;
};

export function getWinstonLogger(options?: WinstonLoggerOptions) {
  const level = options?.level || 'info';
  const defaultMeta = options?.meta || { service: 'http-service' };

  const logger = winston.createLogger({
    level,
    defaultMeta,
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.metadata(),
      winston.format.json({ space: 2 }),
    ),
    transports: [new winston.transports.Console()],
  });

  return logger;
}
