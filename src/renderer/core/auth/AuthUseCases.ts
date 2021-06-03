import type { AuthService } from '@/renderer/core/auth/AuthService';
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { getLogger } from '@/shared/logger';
import { ipcRenderer } from 'electron';
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
    store.commit('authStore/setErrorMessage', '');
    try {
      const user: UserAuthDTO = await this.authService.login(
        username,
        password
      );
      store.commit('authStore/setUser', user);
      store.commit('authStore/setIsLoggedIn', true);
      store.commit('authStore/setToken', user.token);
      ipcRenderer.send('setGlobalUser', user);
    } catch (e) {
      store.commit(
        'authStore/setErrorMessage',
        'Please check your credentials and try again.'
      );
      LOG.error(`Error during login: ${e.message}`);
      throw e;
    }
  }

  async logout(): Promise<void> {
    LOG.debug('logout useCase');
    await store.dispatch('authStore/logout');
  }

  async setAuthFromUserAuthDTO(user: UserAuthDTO) {
    if (user) {
      store.commit('authStore/setUser', user);
      store.commit('authStore/setIsLoggedIn', true);
      store.commit('authStore/setToken', user.token);
    } else {
      await store.dispatch('authStore/logout');
    }
  }
}
