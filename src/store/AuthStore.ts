/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RootState } from '@/store/index';
import { Module } from 'vuex';

export interface AuthState {
  isLoggedIn: boolean;
  user?: unknown;
}

const state: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

const mutations = {
  setUser(state: AuthState, user: unknown): void {
    state.user = user;
  },
  setIsLoggedIn(state: AuthState, isLoggedIn: boolean): void {
    state.isLoggedIn = isLoggedIn;
  },
};
const actions = {
  logout(context: any): void {
    context.commit('setUser', undefined);
    context.commit('setIsLoggedIn', false);
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
