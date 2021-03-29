import { auth, AuthState } from '@/store/AuthStore.ts';
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

Vue.use(Vuex);

export interface RootState {
  authState: AuthState;
}

const store: StoreOptions<RootState> = {
  modules: {
    auth,
  },
};

export default new Vuex.Store<RootState>(store);
