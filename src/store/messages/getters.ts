import { GetterTree } from 'vuex';
import { MessagesState } from './state';
import { RootState } from '@/store';

import moment from 'moment';

export const getters: GetterTree<MessagesState, RootState> = {
  messagesLastRefreshedPretty(state) {
    if (!state.messagesLastRefreshed) {
      return '¯\\_(ツ)_/¯';
    }
    return moment(state.messagesLastRefreshed).fromNow();
  },
};
