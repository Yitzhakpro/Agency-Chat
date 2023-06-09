import { createHttpClient } from '@agency-chat/shared/util-http-client';
import { config } from '../config';
import type { AxiosInstance, CreateAxiosDefaults } from 'axios';

export class BaseService {
  protected client: AxiosInstance;

  // TODO: think of better way to implement robust external service and internal
  constructor(path: string, baseUrl?: string, options?: CreateAxiosDefaults) {
    const baseURL = baseUrl || config.API_URL;

    this.client = createHttpClient(baseURL + path, options);
  }
}
