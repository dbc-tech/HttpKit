import { OptionsOfJSONResponseBody, OptionsWithPagination } from 'got-cjs';
import { ResiliencePolicy } from './http-service-options.type';

export type HttpRequestOptions = OptionsOfJSONResponseBody & {
  resiliencePolicy?: ResiliencePolicy;
};

export type HttpPaginateRequestOptions<T> = OptionsWithPagination<
  T,
  unknown
> & {
  resiliencePolicy?: ResiliencePolicy;
};
