import { IDefaultPolicyContext, type IPolicy } from 'cockatiel';
import { ExtendOptions } from 'got-cjs';
import { Logger } from 'winston';
import { WinstonLoggerOptions } from '../utils';

export type ResiliencePolicy<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A = any,
> = IPolicy<C, A>;

export type ResiliencePolicyLoggingOptions = {
  success?: boolean;
  failure?: boolean;
};

export type DefaultLoggerOptions = WinstonLoggerOptions;

export type HttpServiceOptions<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A = any,
> = ExtendOptions & {
  resiliencePolicy?: ResiliencePolicy<C, A>;
  logger?: Logger;
  defaultLoggerOptions?: DefaultLoggerOptions;
  resiliencePolicyLoggingOptions?: ResiliencePolicyLoggingOptions;
};
