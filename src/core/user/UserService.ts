import { User } from '@/core/auth/models/User';

export interface UserService {
  getUserById(userId: string): Promise<User>;
}
