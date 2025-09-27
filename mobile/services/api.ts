import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { config } from "@/config";

export const api = axios.create({
  baseURL: config.api_url,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});
