import {Module} from 'vuex';
import { RootState } from '@/store';

import actions from './actions';
import getters from './getters';
import state, { AuthState } from './state';
import mutations from './mutations';

const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};

export default authModule;
