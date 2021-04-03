import type { AuthService } from '@/core/auth/AuthService';
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
    const user = await this.authService.login(username, password);
    store.commit('authStore/setUser', user);
    store.commit('authStore/setIsLoggedIn', true);
  }

  async logout(): Promise<void> {
    console.log('logout useCase');
    await store.dispatch('authStore/logout');
  }
}
