import SERVICE from '@/constants/ServiceIdentifiers';
import { AuthService } from '@/core/auth/AuthService';
import { User } from '@/core/auth/models/User';
import { GenericResponse } from '@/GenericResponse';
import { HttpService } from '@/infrastructure/http/HttpService';
import { inject, injectable } from 'inversify';

@injectable()
export class JwtAuthService implements AuthService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  private user: User | undefined;

  async login(login: string, password: string): Promise<User> {
    const response = await this.httpService.post<GenericResponse>('/auth', {
      user: {
        login,
        password,
      },
    });
    console.log(response);

    if (response.data.data.error) {
      console.warn(response.data.error);
      throw new Error(response.data.error);
    }
    // this.user = jwtDecode((response.data.data as any).token);

    this.user = response.data.data as User;
    return this.user;
  }

  logout(): Promise<unknown> {
    console.debug('Logging out...');
    return this.httpService.post<GenericResponse>('/auth/logout');
  }
}
