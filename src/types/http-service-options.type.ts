import { IDefaultPolicyContext, type IPolicy } from 'cockatiel';
import { ExtendOptions } from 'got-cjs';
import { Logger } from 'winston';

export type ResiliencePolicy<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  A = any,
> = IPolicy<C, A>;

export type ResiliencePolicyLoggingOptions = {
  success?: boolean;
  failure?: boolean;
};

export type DefaultLoggerOptions = {
  level?: string;
  meta?: Record<string, unknown>;
};

export type HttpServiceOptions<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  A = any,
> = ExtendOptions & {
  resiliencePolicy?: ResiliencePolicy<C, A>;
  logger?: Logger;
  defaultLoggerOptions?: DefaultLoggerOptions;
  resiliencePolicyLoggingOptions?: ResiliencePolicyLoggingOptions;
};
