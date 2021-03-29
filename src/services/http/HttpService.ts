import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { injectable } from 'inversify';

// ToDo: move to VUE_APP envs
const API_URL = 'http://localhost:1234/api/v1/';

@injectable()
export class HttpService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: API_URL,
    });

    this.httpClient.interceptors.request.use((config) => {
      const newConfig = config;
      // get token from store
      const token = '1234567890';
      newConfig.headers.Authorization = token ? `Bearer ${token}` : '';

      return newConfig;
    });
  }

  async get<T>(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    return this.httpClient.get(url, { params, headers });
  }

  async post<T>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    return this.httpClient.post(url, data, { headers });
  }
}
