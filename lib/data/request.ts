import type { AxiosRequestConfig } from 'axios';
import { api } from '@/lib/api';

/**
 * Unwraps the API envelope `{ success, data }` and returns the inner `data`.
 * Every endpoint function in lib/data/endpoints.ts goes through here, so the
 * app never deals with the envelope directly.
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await api.request<{ success: boolean; data: T }>(config);
  return res.data.data;
}

export const http = {
  get: <T>(url: string, params?: Record<string, unknown>) => request<T>({ method: 'get', url, params }),
  post: <T>(url: string, data?: unknown) => request<T>({ method: 'post', url, data }),
  put: <T>(url: string, data?: unknown) => request<T>({ method: 'put', url, data }),
  patch: <T>(url: string, data?: unknown) => request<T>({ method: 'patch', url, data }),
  del: <T>(url: string) => request<T>({ method: 'delete', url }),
  /** Multipart upload (images). Sets the multipart content-type for the platform. */
  postForm: <T>(url: string, form: FormData) =>
    request<T>({ method: 'post', url, data: form, headers: { 'Content-Type': 'multipart/form-data' } }),
};
