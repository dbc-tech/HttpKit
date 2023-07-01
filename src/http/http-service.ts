import { noop } from 'cockatiel';
import got, {
  AfterResponseHook,
  BeforeRequestHook,
  Got,
  Response,
} from 'got-cjs';
import { Logger } from 'winston';
import { HttpRequestOptions } from '../types/http-request-options.type';
import {
  HttpServiceOptions,
  ResiliencePolicy,
  ResiliencePolicyLoggingOptions,
} from '../types/http-service-options.type';
import { HttpServiceResponse } from '../types/http-service-response.type';
import { getWinstonLogger } from '../utils';
import { DtoConstructor, plainToDto } from '../utils/plain-to-dto';
import { maskObject } from '../utils/mask-object';

export type GetBearerTokenFn = () => Promise<string>;

/**
 * HttpService is a wrapper for the got library to parse API responses.
 */
export class HttpService {
  readonly http: Got;
  readonly defaultHeaders: Record<string, string>;
  private bearerToken: string;
  readonly resiliencePolicy?: ResiliencePolicy;
  readonly logger: Logger;
  readonly resiliencePolicyLoggingOptions: ResiliencePolicyLoggingOptions;

  constructor(
    public readonly baseUrl: string,
    public readonly getAuthToken?: GetBearerTokenFn,
    public readonly options?: HttpServiceOptions,
  ) {
    const { http, resilience, logging } = options || {};

    this.resiliencePolicy = resilience?.policy ?? noop;
    this.resiliencePolicyLoggingOptions = resilience?.options ?? {
      logSuccess: false,
      logFailure: true,
    };
    const winstonLogger =
      logging?.logger ?? getWinstonLogger(logging?.defaultLoggerOptions);
    this.logger = winstonLogger.child({ context: 'http-service' });

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...http?.headers,
    };

    const beforeRequest: BeforeRequestHook[] = this.getAuthToken
      ? [
          async (options) => {
            if (!this.getAuthToken) return;

            if (!this.bearerToken) {
              this.logger.debug('Getting the auth token...');
              this.bearerToken = await this.getAuthToken();
            }

            options.headers.Authorization = `Bearer ${this.bearerToken}`;

            this.logger.debug('Auth token set in the request headers.');
          },
        ]
      : [];

    const afterResponse: AfterResponseHook[] = this.getAuthToken
      ? [
          async (response, retryWithMergedOptions) => {
            if (response.statusCode === 401) {
              this.logger.debug('Auth token expired. Getting a new one...');

              this.bearerToken = await this.getAuthToken();

              const updatedOptions = {
                headers: {
                  Authorization: `Bearer ${this.bearerToken}`,
                },
              };

              this.logger.debug('Retrying the request with the new token.');

              return retryWithMergedOptions(updatedOptions);
            }

            return response;
          },
        ]
      : [];

    this.http = got.extend({
      ...http,
      mutableDefaults: true,
      headers: this.defaultHeaders,
      responseType: 'json',
      hooks: {
        beforeRequest,
        afterResponse,
      },
    });
  }

  async getJson<T>(
    url: URL,
    dtoConstructor?: DtoConstructor<T>,
    options?: HttpRequestOptions,
  ) {
    const { policy, gotOptions } = this.parseOptions(options);

    this.maskedDebugLog({ method: 'getJson', url, gotOptions });

    const res = await policy.execute(() => this.http.get<T>(url, gotOptions));

    return this.makeResponse<T>(res, dtoConstructor);
  }

  async postJson<T>(
    url: URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json?: Record<string, any>,
    dtoConstructor?: DtoConstructor<T>,
    options?: HttpRequestOptions,
  ) {
    const { policy, gotOptions } = this.parseOptions(options);

    this.maskedDebugLog({ method: 'postJson', url, json, gotOptions });

    const res = await policy.execute(() =>
      this.http.post<T>(url, {
        ...gotOptions,
        json,
      }),
    );

    return this.makeResponse<T>(res, dtoConstructor);
  }

  async putJson<T>(
    url: URL,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json?: Record<string, any>,
    dtoConstructor?: DtoConstructor<T>,
    options?: HttpRequestOptions,
  ) {
    const { policy, gotOptions } = this.parseOptions(options);

    this.maskedDebugLog({ method: 'putJson', url, json, gotOptions });

    const res = await policy.execute(() =>
      this.http.put<T>(url, {
        ...gotOptions,
        json,
      }),
    );

    return this.makeResponse<T>(res, dtoConstructor);
  }

  async deleteJson<T>(
    url: URL,
    dtoConstructor?: DtoConstructor<T>,
    options?: HttpRequestOptions,
  ) {
    const { policy, gotOptions } = this.parseOptions(options);

    this.maskedDebugLog({ method: 'deleteJson', url, gotOptions });

    const res = await policy.execute(() =>
      this.http.delete<T>(url, gotOptions),
    );

    return this.makeResponse<T>(res, dtoConstructor);
  }

  makeResponse<T>(
    gotResponse: Response<T>,
    dtoConstructor?: DtoConstructor<T>,
  ): HttpServiceResponse<T> {
    return {
      data: plainToDto<T>(gotResponse.body, dtoConstructor),
      statusCode: gotResponse.statusCode,
    };
  }

  urlFromPath(path: string): URL {
    return new URL(path, this.baseUrl);
  }

  parseOptions(options?: HttpRequestOptions) {
    if (!options) return { policy: this.resiliencePolicy };

    const { resiliencePolicy, ...rest } = options;
    const policy = resiliencePolicy ?? this.resiliencePolicy;

    if (this.resiliencePolicyLoggingOptions) {
      const { logSuccess: success, logFailure: failure } =
        this.resiliencePolicyLoggingOptions;

      if (success)
        policy.onSuccess((data) =>
          this.logger.debug({
            ...data,
            _source: 'resilience-policy-onSuccess',
          }),
        );

      if (failure)
        policy.onFailure((data) =>
          this.logger.warn({
            ...data,
            _source: 'resilience-policy-onFailure',
          }),
        );
    }

    const gotOptions = Object.keys(rest).length ? rest : undefined;

    return { policy, gotOptions };
  }

  mask(obj: object) {
    maskObject(obj, this.options?.logging);
  }

  private maskedDebugLog(obj: object) {
    this.logger.debug(this.mask(obj));
  }
}
