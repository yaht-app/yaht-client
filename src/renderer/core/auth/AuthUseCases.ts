import type { AuthService } from '@/renderer/core/auth/AuthService';
import { User } from '@/renderer/core/auth/models/User';
import { getLogger } from '@/shared/logger';
import { inject, injectable } from 'inversify';
import SERVICE from '@/constants/ServiceIdentifiers.ts';
import store from '@/renderer/ui/store';

const LOG = getLogger('AuthUseCases');

@injectable()
export class AuthUseCases {
  constructor(
    @inject(SERVICE.AUTH)
    private readonly authService: AuthService
  ) {}

  async login(username: string, password: string): Promise<void> {
    LOG.debug('login useCase');
    const user: User = await this.authService.login(username, password);
    store.commit('authStore/setUser', user);
    store.commit('authStore/setIsLoggedIn', true);
    store.commit('authStore/setToken', 'TODO');
  }

  async logout(): Promise<void> {
    LOG.debug('logout useCase');
    await store.dispatch('authStore/logout');
  }
}
