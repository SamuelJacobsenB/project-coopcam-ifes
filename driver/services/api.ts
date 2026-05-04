import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { config } from "@/config";
import { APIResponse } from "@/types";

declare module "axios" {
  interface AxiosInstance {
    get<T = unknown, R = APIResponse<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    post<T = unknown, R = APIResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    put<T = unknown, R = APIResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    delete<T = unknown, R = APIResponse<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R>;
  }
}

export const api = axios.create({
  baseURL: config.api_url,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");

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
