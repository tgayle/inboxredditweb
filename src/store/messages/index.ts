import { RootState } from '@/store';
import { Module } from 'vuex';

import {state, MessagesState} from './state';
import {getters} from './getters';
import {mutations} from './mutations';
import {actions} from './actions';

export const messageModule: Module<MessagesState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default messageModule;
