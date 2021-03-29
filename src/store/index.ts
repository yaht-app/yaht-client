import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { authState, AuthState } from '@/store/AuthStore';

Vue.use(Vuex);

export interface RootState {
  authState: AuthState;
}

const store: StoreOptions<RootState> = {
  modules: {
    authState,
  },
};

export default new Vuex.Store<RootState>(store);
