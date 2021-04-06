import { User } from '@/renderer/core/auth/models/User';
import { UserService } from '@/renderer/core/user/UserService';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';

@injectable()
export class UserUseCases {
  constructor(
    @inject(SERVICE.USER)
    private readonly userService: UserService
  ) {}

  async getUserById(userId: string): Promise<User> {
    return await this.userService.getUserById(userId);
  }
}
