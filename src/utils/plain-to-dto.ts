import { plainToInstance } from 'class-transformer';

export type Unpack<T> = T extends Array<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DtoConstructor<T> = new (...args: any[]) => Unpack<T>;

export const plainToDto = <T>(
  plain: unknown,
  dtoConstructor?: DtoConstructor<T>,
) => {
  const canTransform = dtoConstructor != null && plain != null;
  return (canTransform ? plainToInstance(dtoConstructor, plain) : plain) as T;
};
