import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { authStore, AuthState } from '@/renderer/ui/store/AuthStore';

Vue.use(Vuex);

export interface RootState {
  authStore: AuthState;
}

const store: StoreOptions<RootState> = {
  modules: {
    authStore,
  },
};

export default new Vuex.Store<RootState>(store);
