import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { UserService } from '@/renderer/core/user/UserService';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';

@injectable()
export class UserUseCases {
  constructor(
    @inject(SERVICE.USER)
    private readonly userService: UserService
  ) {}

  async getUserById(userId: string): Promise<UserAuthDTO> {
    return await this.userService.getUserById(userId);
  }
}
