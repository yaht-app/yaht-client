/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO.ts';
import { RootState } from '@/renderer/ui/store/index';
import { ActionContext, Module } from 'vuex';

export interface AuthState {
  isLoggedIn: boolean;
  user?: UserAuthDTO;
  token: string;
  errorMessage?: string;
}

const state: AuthState = {
  isLoggedIn: false,
  user: undefined,
  token: '',
  errorMessage: '',
};

const mutations = {
  setUser(state: AuthState, user: UserAuthDTO): void {
    state.user = user;
  },
  setIsLoggedIn(state: AuthState, isLoggedIn: boolean): void {
    state.isLoggedIn = isLoggedIn;
  },
  setToken(state: AuthState, token: string): void {
    state.token = token;
  },
  setErrorMessage(state: AuthState, error: string): void {
    state.errorMessage = error;
  },
};
const actions = {
  logout(context: ActionContext<AuthState, RootState>): void {
    context.commit('setUser', undefined);
    context.commit('setIsLoggedIn', false);
    context.commit('setToken', '');
    context.commit('setErrorMessage', '');
  },
};
const getters = {};

export const authStore: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
