import { IDefaultPolicyContext, type IPolicy } from 'cockatiel';
import { ExtendOptions } from 'got-cjs';
import { Logger } from './logger.type';

export type HttpOptions = ExtendOptions;

export type ResiliencePolicy<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A = any,
> = IPolicy<C, A>;

export type ResiliencePolicyLoggingOptions = {
  logSuccess?: boolean;
  logFailure?: boolean;
};

export type ResilienceOptions<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A = any,
> = {
  policy?: ResiliencePolicy<C, A>;
  options?: ResiliencePolicyLoggingOptions;
};

export type LoggingOptions = {
  logger?: Logger;
  hideProperties?: string[];
  maskProperties?: string[];
};

export type HttpServiceOptions<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A = any,
> = {
  http?: HttpOptions;
  resilience?: ResilienceOptions<C, A>;
  logging?: LoggingOptions;
};
