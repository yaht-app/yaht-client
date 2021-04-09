import SERVICE from '@/constants/ServiceIdentifiers';
import { AuthService } from '@/renderer/core/auth/AuthService';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { GenericResponse } from '@/renderer/infrastructure/GenericResponse';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { getLogger } from '@/shared/logger';
import { inject, injectable } from 'inversify';

const LOG = getLogger('JwtAuthService');

@injectable()
export class JwtAuthService implements AuthService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  private user: UserAuthDTO | undefined;

  async login(login: string, password: string): Promise<UserAuthDTO> {
    const response = await this.httpService.post<GenericResponse>('/auth', {
      user: {
        login,
        password,
      },
    });
    LOG.debug(response);

    if (response.data.data.error) {
      LOG.error(response.data.error);
      throw new Error(response.data.error);
    }

    this.user = response.data.data as UserAuthDTO;
    return this.user;
  }

  logout(): Promise<unknown> {
    LOG.debug('Logging out...');
    return this.httpService.post<GenericResponse>('/auth/logout');
  }
}
