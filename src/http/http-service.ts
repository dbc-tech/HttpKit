import { noop } from 'cockatiel';
import got, {
  AfterResponseHook,
  BeforeRequestHook,
  Got,
  Response,
} from 'got-cjs';
import { HttpRequestOptions } from '../types/http-request-options.type';
import {
  HttpServiceOptions,
  ResiliencePolicy,
} from '../types/http-service-options.type';
import { HttpServiceResponse } from '../types/http-service-response.type';
import { DtoConstructor, plainToDto } from '../utils/plain-to-dto';

export type GetBearerTokenFn = () => Promise<string>;

/**
 * HttpService is a wrapper for the got library to parse responses APIs.
 */
export class HttpService {
  readonly http: Got;
  readonly defaultHeaders: Record<string, string>;
  private bearerToken: string;
  readonly resiliencePolicy?: ResiliencePolicy;

  constructor(
    public readonly baseUrl: string,
    public readonly getAuthToken?: GetBearerTokenFn,
    public readonly options?: HttpServiceOptions,
  ) {
    const { resiliencePolicy = noop, ...gotOptions } = options || {};
    this.resiliencePolicy = resiliencePolicy;

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...gotOptions?.headers,
    };

    const beforeRequest: BeforeRequestHook[] = this.getAuthToken
      ? [
          async (options) => {
            if (!this.getAuthToken) return;

            if (!this.bearerToken) {
              this.bearerToken = await this.getAuthToken();
            }

            options.headers.Authorization = `Bearer ${this.bearerToken}`;
          },
        ]
      : [];

    const afterResponse: AfterResponseHook[] = this.getAuthToken
      ? [
          async (response, retryWithMergedOptions) => {
            if (response.statusCode === 401) {
              this.bearerToken = await this.getAuthToken();

              const updatedOptions = {
                headers: {
                  Authorization: `Bearer ${this.bearerToken}`,
                },
              };

              return retryWithMergedOptions(updatedOptions);
            }

            return response;
          },
        ]
      : [];

    this.http = got.extend({
      ...gotOptions,
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
    const res = await policy.execute(() => this.http.get<T>(url, gotOptions));
    return this.makeResponse<T>(res, dtoConstructor);
  }

  async postJson<T>(
    url: URL,
    json?: Record<string, any>,
    dtoConstructor?: DtoConstructor<T>,
    options?: HttpRequestOptions,
  ) {
    const { policy, gotOptions } = this.parseOptions(options);
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
    json?: Record<string, any>,
    dtoConstructor?: DtoConstructor<T>,
    options?: HttpRequestOptions,
  ) {
    const { policy, gotOptions } = this.parseOptions(options);
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

    const { resiliencePolicy, ...gotOptions } = options;
    return { policy: resiliencePolicy ?? this.resiliencePolicy, gotOptions };
  }
}
