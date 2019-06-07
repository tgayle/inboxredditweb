import { LocalMessage } from '@/types/Types';

export interface MessagesState {
  conversationMessages: LocalMessage[];
  currentConversation?: string;
  conversationPreviews: LocalMessage[];

  refreshing?: boolean;
}

export const state: MessagesState = {
  conversationMessages: [],
  conversationPreviews: [],
  currentConversation: undefined,
};