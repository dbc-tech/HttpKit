import { plainToInstance } from 'class-transformer';

export type Unpack<T> = T extends Array<infer U> ? U : T;

export type DtoConstructor<T> = new (...args: unknown[]) => Unpack<T>;

export const plainToDto = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plain: any,
  dtoConstructor?: DtoConstructor<T>,
) => {
  const canTransform = dtoConstructor != null && plain != null;
  return (canTransform ? plainToInstance(dtoConstructor, plain) : plain) as T;
};
