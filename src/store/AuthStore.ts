/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { User } from '@/core/auth/models/User';
import { RootState } from '@/store/index';
import { ActionContext, Module } from 'vuex';

export interface AuthState {
  isLoggedIn: boolean;
  user?: User;
}

const state: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

const mutations = {
  setUser(state: AuthState, user: User): void {
    state.user = user;
  },
  setIsLoggedIn(state: AuthState, isLoggedIn: boolean): void {
    state.isLoggedIn = isLoggedIn;
  },
};
const actions = {
  logout(context: ActionContext<AuthState, RootState>): void {
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
