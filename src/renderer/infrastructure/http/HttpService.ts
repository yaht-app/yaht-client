import store from '@/renderer/ui/store';
import SERVICE from '@/constants/ServiceIdentifiers';
import { AuthService } from '@/renderer/core/auth/AuthService';
import { getLogger } from '@/shared/logger';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

const LOG = getLogger('HttpService');
const API_URL = process.env.VUE_APP_API_URL;

@injectable()
export class HttpService {
  private httpClient: AxiosInstance;

  constructor(
    @inject(SERVICE.AUTH)
    private readonly authService: AuthService
  ) {
    this.httpClient = axios.create({
      baseURL: API_URL,
    });

    this.httpClient.interceptors.request.use((config) => {
      const newConfig = config;
      const token = store.state.authStore.token || authService.getToken();
      newConfig.headers.Authorization = token ? `Bearer ${token}` : '';
      newConfig.headers.ClientVersion = window
        .require('electron')
        .remote.app.getVersion();
      return newConfig;
    });
  }

  async get<T>(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    try {
      return this.httpClient.get(url, { params, headers });
    } catch (e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        LOG.error(
          `GET request failed with status ${e.response.status} and data ${e.response.data}`
        );
      } else if (e.request) {
        // The request was made but no response was received
        LOG.error(
          `GET request failed with no response, request is ${e.request}`
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        LOG.error(
          `GET request failed with no response or request, Error: ${e.message}`
        );
      }
      throw e;
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    try {
      return this.httpClient.post(url, data, { headers });
    } catch (e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        LOG.error(
          `POST request failed with status ${e.response.status} and data ${e.response.data}`
        );
      } else if (e.request) {
        // The request was made but no response was received
        LOG.error(
          `POST request failed with no response, request is ${e.request}`
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        LOG.error(
          `POST request failed with no response or request, Error: ${e.message}`
        );
      }
      throw e;
    }
  }

  async put<T>(
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<AxiosResponse<T>> {
    try {
      return this.httpClient.put(url, data, { headers });
    } catch (e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        LOG.error(
          `PUT request failed with status ${e.response.status} and data ${e.response.data}`
        );
      } else if (e.request) {
        // The request was made but no response was received
        LOG.error(
          `PUT request failed with no response, request is ${e.request}`
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        LOG.error(
          `PUT request failed with no response or request, Error: ${e.message}`
        );
      }
      throw e;
    }
  }
}
