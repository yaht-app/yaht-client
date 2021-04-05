import { User } from '@/core/auth/models/User';

export interface AuthService {
  login(login: string, password: string): Promise<User>;
  logout(): Promise<unknown>;
}
