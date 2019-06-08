import { MutationTree } from 'vuex';
import { MessagesState } from './state';
import { LocalMessage } from '@/types/Types';

export const SET_CURRENT_CONVERSATION = 'setCurrentConversation';
export const SET_CONVERSATION_PREVIEWS = 'setConversationPreviews';
export const SET_CONVERSATION_MESSAGES = 'setConversationMessages';
export const SET_REFRESHING = 'setRefreshing';
export const SET_MESSAGES_LAST_REFRESHED = 'setMessagesLastRefreshed';

export const mutations: MutationTree<MessagesState> = {
  [SET_CURRENT_CONVERSATION](state, name: string) {
    state.currentConversation = name;
  },
  [SET_CONVERSATION_PREVIEWS](state, conversations: LocalMessage[]) {
    state.conversationPreviews = conversations;
  },
  [SET_CONVERSATION_MESSAGES](state, messages: LocalMessage[]) {
    state.conversationMessages = messages;
  },
  [SET_REFRESHING](state, refreshing: boolean) {
    state.refreshing = refreshing;
  },
  [SET_MESSAGES_LAST_REFRESHED](state, lastRefreshed: number) {
    state.messagesLastRefreshed = lastRefreshed;
  },
};
