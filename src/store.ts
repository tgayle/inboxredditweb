import Vue from 'vue';
import Vuex from 'vuex';
import snoowrap from 'snoowrap';

Vue.use(Vuex);

export interface RootState {
  redditAuthUrl: string;
}

export default new Vuex.Store<RootState>({
  state: {
    redditAuthUrl: snoowrap.getAuthUrl({
      clientId: process.env.VUE_APP_CLIENTID as string,
      redirectUri: process.env.VUE_APP_REDIRECT as string,
      permanent: true,
      scope: ['identity', 'privatemessages', 'read', 'report'],
    }),
  },
  mutations: {

  },
  actions: {

  },
});
