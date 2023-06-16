import { OptionsOfJSONResponseBody } from 'got-cjs';
import { ResiliencePolicy } from './http-service-options.type';

export type HttpRequestOptions = OptionsOfJSONResponseBody & {
  resiliencePolicy?: ResiliencePolicy;
};
