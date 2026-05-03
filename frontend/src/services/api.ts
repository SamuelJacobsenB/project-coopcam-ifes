/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { config } from "../config";

export interface APIResponse<T = any> {
  code: string;
  data: T;
  message?: string;
  request_id?: string;
}

declare module "axios" {
  interface AxiosInstance {
    get<T = any, R = APIResponse<T>>(url: string, config?: any): Promise<R>;
    post<T = any, R = APIResponse<T>>(
      url: string,
      data?: any,
      config?: any,
    ): Promise<R>;
    put<T = any, R = APIResponse<T>>(
      url: string,
      data?: any,
      config?: any,
    ): Promise<R>;
    delete<T = any, R = APIResponse<T>>(url: string, config?: any): Promise<R>;
  }
}

export const api = axios.create({
  baseURL: config.api_url,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Objeto de Resposta personaliado do Go é retornado em response.data
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);
