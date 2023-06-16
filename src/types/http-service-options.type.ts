import { ExtendOptions } from 'got-cjs';
import { IDefaultPolicyContext, type IPolicy } from 'cockatiel';

export type ResiliencePolicy<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  A = any,
> = IPolicy<C, A>;

export type HttpServiceOptions<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  A = any,
> = ExtendOptions & { resiliencePolicy?: ResiliencePolicy<C, A> };
