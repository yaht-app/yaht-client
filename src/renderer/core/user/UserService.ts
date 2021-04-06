import { User } from '@/renderer/core/auth/models/User';

export interface UserService {
  getUserById(userId: string): Promise<User>;
}
