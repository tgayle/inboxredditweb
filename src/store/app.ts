import {Module} from 'vuex';
import { RootState } from '@/store';
import messagesModule from './messages/index';

interface AppState {
}

const appModule: Module<AppState, RootState> = {
  namespaced: true,
  modules: {
    messages: messagesModule,
  },
};

export default appModule;
