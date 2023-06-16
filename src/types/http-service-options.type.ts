import { ExtendOptions } from 'got-cjs';
import { IDefaultPolicyContext, type IPolicy } from 'cockatiel';

export type Policies<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  A = any,
> = Array<IPolicy<C, A>>;

export type HttpServiceOptions<
  C extends IDefaultPolicyContext = IDefaultPolicyContext,
  A = any,
> = ExtendOptions & { policies?: Policies };
