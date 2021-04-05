import SERVICE from '@/constants/ServiceIdentifiers';
import { User } from '@/core/auth/models/User';
import { UserService } from '@/core/user/UserService';
import { GenericResponse } from '@/GenericResponse';
import { HttpService } from '@/infrastructure/http/HttpService';
import { inject, injectable } from 'inversify';

@injectable()
export class HttpUserService implements UserService {
  constructor(
    @inject(SERVICE.HTTP)
    private readonly httpService: HttpService
  ) {}

  async getUserById(userId: string): Promise<User> {
    const response = await this.httpService.get<GenericResponse>(
      `/users/${userId}`
    );
    return response.data.data;
  }
}
