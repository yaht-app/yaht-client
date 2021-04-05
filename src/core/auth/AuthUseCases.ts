import type { AuthService } from '@/core/auth/AuthService';
import { User } from '@/core/auth/models/User';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';
import store from '@/store';

@injectable()
export class AuthUseCases {
  constructor(
    @inject(SERVICE.AUTH)
    private readonly authService: AuthService
  ) {}

  async login(username: string, password: string): Promise<void> {
    console.log('login useCase');
    try {
      const user: User = await this.authService.login(username, password);
      store.commit('authStore/setUser', user);
      store.commit('authStore/setIsLoggedIn', true);
    } catch (e) {
      console.error('An error occurred in AuthUseCases:login :', e);
    }
  }

  async logout(): Promise<void> {
    console.log('logout useCase');
    await store.dispatch('authStore/logout');
  }
}
