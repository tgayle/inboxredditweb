import { RootState } from '@/store';
import { Module } from 'vuex';
import { LocalMessage } from '@/types/Types';
import { generateConversations, filterToNewestMessageOfConversation } from '@/util';

interface MessagesState {
  conversationMessages: LocalMessage[];
  currentConversation?: string;

}

const messagesModule: Module<MessagesState, RootState> = {
  namespaced: true,
  state: {
    conversationMessages: generateConversations(30, 45),
    currentConversation: undefined,
  },
  mutations: {
    setCurrentConversation(state, name: string) {
      state.currentConversation = name;
    },
  },
  getters: {
    conversationPreviews(state) {
      return filterToNewestMessageOfConversation(state.conversationMessages || []);
    },
    currentConversationMessages(state) {
      return state.conversationMessages.filter((msg) => msg.firstMessageName === state.currentConversation);
    },
  },
  actions: {
    openConversation({commit, dispatch}, firstMessageName: string) {
      commit('setCurrentConversation', firstMessageName);
    },
  },
};

export default messagesModule;
