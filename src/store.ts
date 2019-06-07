import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';

import authModule from './store/auth/index';
import appModule from './store/app';
import uiModule from './store/ui/ui';
import snoowrap from 'snoowrap';
import { LocalUser } from './types/Types';

Vue.use(Vuex);

export interface RootState {}

export default new Vuex.Store<RootState>({
  modules: {
    auth: authModule,
    app: appModule,
    ui: uiModule,
  },
});

export function getSnoowrap<T>(context: ActionContext<T, RootState>) {
  return context.rootGetters['auth/snoowrap'] as snoowrap;
}

export function getCurrentUser<T>(context: ActionContext<T, RootState>) {
  return (context.rootState as any).auth.currentUser as LocalUser | undefined;
}
