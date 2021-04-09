import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';

export interface AuthService {
  login(login: string, password: string): Promise<UserAuthDTO>;
  logout(): Promise<unknown>;
}
