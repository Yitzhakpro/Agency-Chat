import { createHttpClient } from '@agency-chat/shared/util-http-client';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { config } from '../config';

export class BaseService {
  #client: AxiosInstance;

  // TODO: think of better way to implement robust external service and internal
  constructor(path: string, baseUrl?: string, options?: CreateAxiosDefaults) {
    const baseURL = baseUrl || config.API_URL;

    this.#client = createHttpClient(baseURL + path, options);
  }
}
