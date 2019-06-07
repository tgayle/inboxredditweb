import { RootState, getSnoowrap, getCurrentUser } from '@/store';
import { Module } from 'vuex';
import { LocalMessage, SourceInbox, RemotePrivateMessage } from '@/types/Types';
import { filterToNewestMessageOfConversation } from '@/util';
import snoowrap from 'snoowrap';
import { messageCollection } from '@/persistence/InboxDatabase';

interface MessagesState {
  conversationMessages: LocalMessage[];
  currentConversation?: string;
  conversationPreviews: LocalMessage[];

}

const messagesModule: Module<MessagesState, RootState> = {
  namespaced: true,
  state: {
    conversationMessages: [],
    conversationPreviews: [],
    currentConversation: undefined,
  },
  mutations: {
    setCurrentConversation(state, name: string) {
      state.currentConversation = name;
    },
    setConversationPreviews(state, conversations: LocalMessage[]) {
      state.conversationPreviews = conversations;
    },
    setConversationMessages(state, messages: LocalMessage[]) {
      state.conversationMessages = messages;
    },
  },
  actions: {
    async beginPeriodicUpdates({dispatch}) {
      dispatch('update');

      setInterval(() => {
        dispatch('update');
      }, 10000);
    },
    /**
     * Updates values in state to reflect DB so we can display in view.
     */
    async update({dispatch}) {
      dispatch('updateRecentConversations');
    },
    async openConversation(context, firstMessageName: string) {
      const {commit} = context;

      const currentUser = getCurrentUser(context);
      commit('setCurrentConversation', firstMessageName);
      commit('setConversationMessages', messageCollection.find({
        owner: currentUser ? currentUser.id : undefined,
        firstMessageName,
      }));
    },
    async updateRecentConversations(context) {
      const {commit} = context;
      const currentUser = getCurrentUser(context);

      const recents = messageCollection.chain()
        .find({
          owner: currentUser ? currentUser.id : undefined,
        })
        .simplesort('createdUtc', {desc: true})
        .mapReduce(conversationResolver.mapper, conversationResolver.reducer);

      commit('setConversationPreviews', recents.reverse());
    },
    async loadAllMessages(context) {
      const snoo = getSnoowrap(context);

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

      let successfullySaved = 0;
      let numErrors = 0;
      // Insert each separately so we can ignore errors.
      for (const msg of messagesToSave.flat()) {
        try {
          messageCollection.insert(msg);
          successfullySaved++;
        } catch (error) {
          if (!error.message.includes('Duplicate key')) { console.log(error); }
          numErrors++;
        }
      }

      console.log(successfullySaved, 'messages saved,', numErrors, 'errors.');
    },
  },
};

function mapRemoteMessagesToLocal(messages: any[], owner: string, sourceInbox: SourceInbox): LocalMessage[] {
  return messages
    .filter(isPrivateMessage)
    .map((msg) => {
      const mappedMessage: LocalMessage = mapRemoteMessageToLocal(msg, owner, sourceInbox);
      return mappedMessage;
    });
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

const conversationResolver = {
  mapper(message: LocalMessage) {
    return message;
  },
  reducer(messages: LocalMessage[]) {
    return filterToNewestMessageOfConversation(messages);
  },
};

export default messagesModule;
