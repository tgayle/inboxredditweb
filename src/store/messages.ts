import { RootState } from '@/store';
import { Module } from 'vuex';
import { LocalMessage, SourceInbox, RemotePrivateMessage } from '@/types/Types';
import { generateConversations, filterToNewestMessageOfConversation } from '@/util';
import snoowrap from 'snoowrap';
import { messageCollection } from '@/persistence/InboxDatabase';

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
    setMessages(state, messages: LocalMessage[]) {
      state.conversationMessages = messages;
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
    async openConversation({commit, dispatch}, firstMessageName: string) {
      commit('setCurrentConversation', firstMessageName);
    },
    async loadAllMessages(context) {
      const snoo: snoowrap = context.rootGetters['auth/snoowrap'];

      console.log('Loading messages...');

      const owner = await snoo.getMe().id;
      const [initialInbox, initialSent] = await Promise.all([
        snoo.getInbox({filter: 'messages'}),
        snoo.getSentMessages(),
      ]);

      const [allInbox, allSent] = await Promise.all([initialInbox.fetchAll(), initialSent.fetchAll()]);
      console.log('Messages loaded.');
      const messagesToSave = await Promise.all([
        mapRemoteMessagesToLocal(allInbox, owner, 'inbox'),
        mapRemoteMessagesToLocal(allSent, owner, 'sent'),
      ]);

      for (const msg of messagesToSave.flat()) {
        try {
          const transaction = messageCollection.insert(msg);
          console.log(msg);
          console.log(`${transaction ? transaction.id : 'idk'} saved!!`);
        } catch (error) {
          console.log(error.message);
        }
      }

      context.commit('setMessages', messageCollection.find());
    },
  },
};

function mapRemoteMessagesToLocal(messages: any[], owner: string, sourceInbox: SourceInbox): Promise<LocalMessage[]> {
  return Promise.all(messages
    .filter(isPrivateMessage)
    .map((msg) => {
      const mappedMessage: LocalMessage = mapRemoteMessageToLocal(msg, owner, sourceInbox);
      return mappedMessage;
    }));
}

function mapRemoteMessageToLocal(msg: snoowrap.PrivateMessage,
                                 owner: string,
                                 sourceInbox: SourceInbox): LocalMessage {
  return {
    owner,
    id: `${msg.name}_${sourceInbox}`,
    author: msg.author.name,
    body: msg.body,
    createdUtc: msg.created_utc * 1000,
    dest: msg.dest,
    firstMessageName: msg.first_message_name || msg.name,
    isNew: msg.new,
    name: msg.name,
    subject: msg.subject,
    from: sourceInbox,
  };
}

function isPrivateMessage(msg: any): msg is snoowrap.PrivateMessage {
  return msg instanceof RemotePrivateMessage;
}

export default messagesModule;
