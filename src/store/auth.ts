import {Module} from 'vuex';
import { RootState } from '@/store';

import snoowrap from 'snoowrap';
import { TokenRetrievalResponse, LocalUser } from '@/types/Types';
import { userCollection, databaseReady } from '@/persistence/InboxDatabase';

interface AuthButtonState {
  shown: boolean;
  text: 'Retry' | 'Continue';
  link: string;
}

interface AuthState {
  loggingIn: boolean;
  loginStatus: string;
  buttonState: AuthButtonState;
  redditAuthUrl: string;
  currentUser?: LocalUser;
}

const redditAuthUrl = snoowrap.getAuthUrl({
  clientId: process.env.VUE_APP_CLIENTID as string,
  redirectUri: process.env.VUE_APP_REDIRECT as string,
  permanent: true,
  scope: ['identity', 'privatemessages', 'read', 'report'],
});

const clientId  = process.env.VUE_APP_CLIENTID as string;
const userAgent = process.env.VUE_APP_USERAGENT as string;

const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state: {
    redditAuthUrl,
    loginStatus: 'This might take a moment...',
    loggingIn: false,
    buttonState: {
      shown: false,
      text: 'Retry',
      link: redditAuthUrl,
    },

    currentUser: undefined,
  },
  mutations: {
    setLoggingIn(state, loggingIn: boolean) {
      state.loggingIn = loggingIn;
    },
    setLoginStatus(state, message: string) {
      state.loginStatus = message;
    },
    setButtonState(state, btnState: AuthButtonState) {
      state.buttonState = {
        ...state.buttonState,
        ...btnState,
      };
    },
    setRetryButton(state) {
      state.buttonState = {
        shown: true,
        text: 'Retry',
        link: redditAuthUrl,
      };
    },
    setContinueButton(state) {
      state.buttonState = {
        shown: true,
        text: 'Continue',
        link: '/app',
      };
    },
    setCurrentUser(state, user: LocalUser) {
      state.currentUser = user;
      localStorage.setItem('currentUser', user.name);
      console.log(`Current user is ${state.currentUser.name}`);
    },
  },
  getters: {
    snoowrap(state) {
      if (state.currentUser) {
        return new snoowrap({
          accessToken: state.currentUser.accessToken,
          refreshToken: state.currentUser.refreshToken,
          clientId,
          userAgent,
        });
      }
      return undefined;
    },
  },
  actions: {
    async appFirstLoaded({commit}) {
      await databaseReady;

      const lastUser = localStorage.getItem('currentUser');
      if (!lastUser) { return; }
      const userInfo = userCollection.findOne({name: lastUser});
      if (!userInfo) { return; }

      commit('setCurrentUser', userInfo);
    },
    async loginUser({commit, rootState}, routeQueries: TokenRetrievalResponse) {
      commit('setLoggingIn', true);
      if (routeQueries.error) {
        commit('setLoggingIn', false);
        commit('setRetryButton');
      } else {
        try {
          const args = {
            clientId,
            userAgent,
            redirectUri: process.env.VUE_APP_REDIRECT as string,
            code: routeQueries.code,
          };
          const userSnoowrap = await snoowrap.fromAuthCode(args);
          // snoowrap typings require using .then instead of await
          userSnoowrap.getMe().then((userInfo) => {
           let currentUser: LocalUser | null | undefined = userCollection.findOne({id: userInfo.id});

           if (!currentUser) {
              currentUser = userCollection.insert({
                accessToken: userSnoowrap.accessToken,
                refreshToken: userSnoowrap.refreshToken,
                id: userInfo.id,
                name: userInfo.name,
                tokenExpirationDate: userSnoowrap.tokenExpiration,
              });
            }

           commit('setLoggingIn', false);
           commit('setLoginStatus', `Success! Hello /u/${userInfo.name}`);
           commit('setContinueButton');
           commit('setCurrentUser', currentUser);
          });
        } catch (e) {
          const errorMessage = e.message; // TODO: Prettify error message.
          commit('setLoggingIn', false);
          commit('setLoginStatus', errorMessage);
          commit('setRetryButton');
        }
      }
    },
  },
};

export default authModule;
