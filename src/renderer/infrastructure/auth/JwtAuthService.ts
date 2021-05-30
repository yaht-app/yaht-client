import { AuthService } from '@/renderer/core/auth/AuthService';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { getLogger } from '@/shared/logger';
import axios, { AxiosInstance } from 'axios';
import { injectable } from 'inversify';

const LOG = getLogger('JwtAuthService');
const API_URL = process.env.VUE_APP_API_URL;

@injectable()
export class JwtAuthService implements AuthService {
  private httpAuthClient: AxiosInstance;
  private user: UserAuthDTO | undefined;

  constructor() {
    this.httpAuthClient = axios.create({
      baseURL: API_URL,
    });
  }
  async login(login: string, password: string): Promise<UserAuthDTO> {
    const response = await this.httpAuthClient.post(`${API_URL}/auth`, {
      user: {
        login,
        password,
      },
    });

    this.user = response.data.data as UserAuthDTO;
    return this.user;
  }

  logout(): Promise<unknown> {
    LOG.debug('Logging out...');
    return this.httpAuthClient.post('/auth/logout');
  }

  getToken(): string {
    return this.user?.token || global.user.token || '';
  }
}
