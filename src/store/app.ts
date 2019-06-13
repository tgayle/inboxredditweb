import {Module} from 'vuex';
import { RootState } from '@/store';
import messagesModule from './messages/index';

interface AppState {
  darkModeEnabled: boolean;
}

const appModule: Module<AppState, RootState> = {
  namespaced: true,
  modules: {
    messages: messagesModule,
  },
  state: {
    darkModeEnabled: !!localStorage.getItem('darkMode'),
  },
  mutations: {
    changeTheme(state, darkModeEnabled: boolean) {
      state.darkModeEnabled = darkModeEnabled;
      localStorage.setItem('darkMode', darkModeEnabled + '');
    },
  },
  actions: {
    changeAppTheme({commit}, darkMode: boolean) {
      commit('changeTheme', darkMode);
    },
  },
};

export default appModule;
