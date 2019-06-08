import { MutationTree } from 'vuex';
import { MessagesState } from './state';
import { LocalMessage } from '@/types/Types';

export const mutations: MutationTree<MessagesState> = {
  setCurrentConversation(state, name: string) {
    state.currentConversation = name;
  },
  setConversationPreviews(state, conversations: LocalMessage[]) {
    state.conversationPreviews = conversations;
  },
  setConversationMessages(state, messages: LocalMessage[]) {
    state.conversationMessages = messages;
  },
  setRefreshing(state, refreshing: boolean) {
    state.refreshing = refreshing;
  },
  setMessagesLastRefreshed(state, lastRefreshed: number) {
    state.messagesLastRefreshed = lastRefreshed;
  },
};
