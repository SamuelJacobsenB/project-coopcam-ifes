export interface APIResponse<T = unknown> {
  code: string;
  data: T;
  message?: string;
  request_id?: string;
}
