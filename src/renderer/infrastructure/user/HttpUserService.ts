import SERVICE from '@/constants/ServiceIdentifiers';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { UserService } from '@/renderer/core/user/UserService';
import { GenericResponse } from '@/renderer/infrastructure/GenericResponse';
import { HttpService } from '@/renderer/infrastructure/http/HttpService';
import { inject, injectable } from 'inversify';

@injectable()
export class HttpUserService implements UserService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async getUserById(userId: string): Promise<UserAuthDTO> {
    const response = await this.httpService.get<GenericResponse>(
      `/users/${userId}`
    );
    return response.data.data;
  }
}
