import axios from 'axios';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';

export const createHttpClient = (
  baseURL: string,
  options?: CreateAxiosDefaults
): AxiosInstance => {
  const instance = axios.create({ baseURL, ...options });

  return instance;
};
