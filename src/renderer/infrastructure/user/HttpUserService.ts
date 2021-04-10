import SERVICE from '@/constants/ServiceIdentifiers';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { UserService } from '@/renderer/core/user/UserService';
import { GenericResponse } from '@/renderer/infrastructure/GenericResponse';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { getLogger } from '@/shared/logger';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

@injectable()
export class HttpUserService implements UserService {
  private readonly LOG = getLogger('HttpUserService');
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async getUserById(userId: string): Promise<UserAuthDTO> {
    const response: AxiosResponse<
      GenericResponse<UserAuthDTO>
    > = await this.httpService.get(`/users/${userId}`);

    this.LOG.debug(`Got occurrencesByUserId(${userId}): `, response.data.data);
    return response.data.data;
  }
}
