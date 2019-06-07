import { ActionTree } from 'vuex';
import { MessagesState } from './state';
import { RootState, getCurrentUser, getSnoowrap } from '@/store';
import { messageCollection, upsert } from '@/persistence/InboxDatabase';
import { SourceInbox, LocalMessage, RemotePrivateMessage } from '@/types/Types';
import snoowrap from 'snoowrap';
import { filterToNewestMessageOfConversation } from '@/util';

export const actions: ActionTree<MessagesState, RootState> = {
  async beginPeriodicUpdates({dispatch}) {
    dispatch('update');

    setInterval(() => {
      dispatch('update');
      dispatch('refreshMessages');
    }, 10000);
  },
  /**
   * Updates values in state to reflect DB so we can display in view.
   */
  async update({dispatch}) {
    dispatch('updateRecentConversations');
    dispatch('updateConversationMessages');
  },
  async openConversation(context, firstMessageName: string) {
    const {commit} = context;

    const currentUser = getCurrentUser(context);
    commit('setCurrentConversation', firstMessageName);

    const messages = messageCollection
      .chain()
      .find({
        owner: currentUser ? currentUser.id : undefined,
        firstMessageName,
      })
      .simplesort('createdUtc')
      .data();

    commit('setConversationMessages', messages);
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
  async updateConversationMessages({dispatch, state}) {
    if (state.currentConversation) {
      dispatch('openConversation', state.currentConversation);
    }
  },
  async refreshMessages(context) {
    context.commit('setRefreshing', true);
    try {
      await Promise.all([
        context.dispatch('loadUnreadMessages'),
        context.dispatch('loadNewestMessages'),
      ]);
    } catch (error) {
      console.log('Some error happened.');
    }

    context.commit('setRefreshing', false);
    context.commit('setMessagesLastRefreshed', Date.now());
  },
  async loadUnreadMessages(context) {
    const currentUser = getCurrentUser(context);
    if (!currentUser) { return; }

    const snoo = getSnoowrap(context);
    const initialUnread = await snoo.getUnreadMessages();
    const allUnread = await initialUnread.fetchAll();

    const messagesToSave: LocalMessage[] = [];

    /* Unread messages might be messages we sent to ourselves or some we received, so check which
       inbox it belongs to based on who sent and received the message.
    */
    for (const msg of allUnread) {
      let inbox: SourceInbox = 'inbox';
      if (msg.dest === msg.author.name) {
        inbox = 'sent';
      }
      messagesToSave.push(mapRemoteMessageToLocal(msg, currentUser.id, inbox));
    }

    saveMessages(messagesToSave);
  },
  async loadNewestMessages(context) {
    const currentUser = getCurrentUser(context);
    const newestMessage = messageCollection
      .chain()
      .find({
        owner: currentUser ? currentUser.id : undefined,
      })
      .simplesort('createdUtc', {desc: true})
      .limit(1)
      .data()[0];

    await context.dispatch('loadAllMessages', newestMessage ? newestMessage.name : undefined);
  },
  async loadAllMessages(context, before?: string) {
    const snoo = getSnoowrap(context);

    const owner = await snoo.getMe().id;
    const [initialInbox, initialSent] = await Promise.all([
      snoo.getInbox({ before } as any),
      snoo.getSentMessages({before}),
    ]);

    const [allInbox, allSent] = await Promise.all([
      initialInbox.fetchAll(),
      initialSent.fetchAll(),
    ]);

    console.log('Messages loaded.');
    const messagesToSave = [
      ...mapRemoteMessagesToLocal(allInbox, owner, 'inbox'),
      ...mapRemoteMessagesToLocal(allSent, owner, 'sent'),
    ];

    saveMessages(messagesToSave);
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

function saveMessages(messages: LocalMessage[]): [number, number] {
    let successfullySaved = 0;
    let numErrors = 0;

    // Insert each separately so we can ignore errors.
    for (const msg of messages) {
      try {
        upsert(messageCollection, 'id', msg);
        successfullySaved++;
      } catch (error) {
      if (!error.message.includes('Duplicate key')) { console.log(error); }
      numErrors++;
    }
  }

    return [successfullySaved, numErrors];
}

const conversationResolver = {
  mapper(message: LocalMessage) {
    return message;
  },
  reducer(messages: LocalMessage[]) {
    return filterToNewestMessageOfConversation(messages);
  },
};
