import Vue from 'vue';
import Vuex from 'vuex';

import authModule from './store/auth/index';
import appModule from './store/app';

Vue.use(Vuex);

export interface RootState {}

export default new Vuex.Store<RootState>({
  modules: {
    auth: authModule,
    app: appModule,
  },
});
