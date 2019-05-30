import {Module} from 'vuex';
import { RootState } from '@/store';

import snoowrap from 'snoowrap';
import { TokenRetrievalResponse } from '@/types/Types';

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
}

const redditAuthUrl = snoowrap.getAuthUrl({
  clientId: process.env.VUE_APP_CLIENTID as string,
  redirectUri: process.env.VUE_APP_REDIRECT as string,
  permanent: true,
  scope: ['identity', 'privatemessages', 'read', 'report'],
});

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
  },
  actions: {
    async loginUser({commit, rootState}, routeQueries: TokenRetrievalResponse) {
      commit('setLoggingIn', true);
      if (routeQueries.error) {
        commit('setLoggingIn', false);
        commit('setRetryButton');
      } else {
        try {
          const args = {
            clientId: process.env.VUE_APP_CLIENTID as string,
            redirectUri: process.env.VUE_APP_REDIRECT as string,
            userAgent: process.env.VUE_APP_USERAGENT as string,
            code: routeQueries.code,
          };
          const userSnoowrap = await snoowrap.fromAuthCode(args);
          // TODO: Persist user login.
          commit('setLoggingIn', false);
          commit('setLoginStatus', `Success! Hello /u/${await userSnoowrap.getMe().name}`);
          commit('setContinueButton');
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
