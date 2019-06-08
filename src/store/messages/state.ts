import { LocalMessage } from '@/types/Types';

export interface MessagesState {
  conversationMessages: LocalMessage[];
  currentConversation?: string;
  conversationPreviews: LocalMessage[];

  refreshing?: boolean;
  messagesLastRefreshed?: number;
}

export const state: MessagesState = {
  conversationMessages: [],
  conversationPreviews: [],
  refreshing: false,
  currentConversation: undefined,
  messagesLastRefreshed: undefined,
};
