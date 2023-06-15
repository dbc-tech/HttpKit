export type HttpServiceResponse<T> = {
  statusCode?: number;
  data?: T;
};
