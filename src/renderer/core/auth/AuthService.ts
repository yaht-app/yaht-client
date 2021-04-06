import { User } from '@/renderer/core/auth/models/User';

export interface AuthService {
  login(login: string, password: string): Promise<User>;
  logout(): Promise<unknown>;
}
