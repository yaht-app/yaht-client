import { RootState } from '@/store/index';
import { Module } from 'vuex';

export interface AuthState {
  isLoggedIn: boolean;
  user?: unknown;
}

const namespaced = true;
const state: AuthState = {
  isLoggedIn: false,
  user: undefined,
};
const mutations = {};
const actions = {};
const getters = {};

export const authState: Module<AuthState, RootState> = {
  namespaced,
  state,
  mutations,
  actions,
  getters,
};
