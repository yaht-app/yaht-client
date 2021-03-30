import SERVICE from '@/constants/ServiceIdentifiers';
import { AuthService } from '@/core/auth/AuthService';
import { HttpService } from '@/infrastructure/http/HttpService';
import store from '@/store';
import { inject, injectable } from 'inversify';
import jwtDecode, { JwtPayload } from 'jwt-decode';

@injectable()
export class JwtAuthService implements AuthService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async login(username: string, password: string): Promise<unknown> {
    console.log('login', username, password);

    console.log(Notification.permission);
    console.log(store.state.authStore.isLoggedIn);

    try {
      /*
      const response = await this.httpService.post('/auth/login', {
        username,
        password,
      });
      const user = jwtDecode(response.data.token);
      */
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const decoded = jwtDecode<JwtPayload>(token);
      console.log(decoded);
      return decoded;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  logout(): Promise<unknown> {
    console.log('logout');
    return Promise.resolve(undefined);
  }
}
