import store from '@/renderer/ui/store';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { injectable } from 'inversify';

const API_URL = process.env.VUE_APP_API_URL;

@injectable()
export class HttpService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: API_URL,
    });

    this.httpClient.interceptors.request.use((config) => {
      const newConfig = config;
      const token = store.state.authStore.token;
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
