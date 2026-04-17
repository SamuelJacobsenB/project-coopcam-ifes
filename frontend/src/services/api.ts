import axios from "axios";
import { config } from "../config";

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
