import { Logger } from '../types';

export const nullLogger = (): Logger => {
  return {
    error: (message: string, ...args: unknown[]) => nop(message, ...args),
    warn: (message: string, ...args: unknown[]) => nop(message, ...args),
    info: (message: string, ...args: unknown[]) => nop(message, ...args),
    debug: (message: string, ...args: unknown[]) => nop(message, ...args),
    trace: (message: string, ...args: unknown[]) => nop(message, ...args),
  };
};

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export const nop = (message: string, ...args: unknown[]) => {};

export const consoleLogger = (): Logger => {
  return {
    error: (message: string, ...args: unknown[]) =>
      console.error(message, ...args),
    warn: (message: string, ...args: unknown[]) =>
      console.warn(message, ...args),
    info: (message: string, ...args: unknown[]) =>
      console.info(message, ...args),
    debug: (message: string, ...args: unknown[]) =>
      console.debug(message, ...args),
    trace: (message: string, ...args: unknown[]) =>
      console.trace(message, ...args),
  };
};
