import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';

export interface UserService {
  getUserById(userId: string): Promise<UserAuthDTO>;
}
