import { MutationTree } from 'vuex';
import { AuthState, AuthButtonState, redditAuthUrl } from './state';
import { LocalUser } from '@/types/Types';

export const SET_LOGGING_IN = 'setLoggingIn';
export const SET_LOGIN_STATUS = 'setLoginStatus';
export const SET_BUTTON_STATE = 'setButtonState';
export const RETRY_BUTTON_ACTIVE = 'setRetryButton';
export const CONTINUE_BUTTON_ACTIVE = 'setContinueButton';
export const SET_CURRENT_USER = 'setCurrentUser';
export const SET_USERS_LIST = 'setUsersList';

const authMutations: MutationTree<AuthState> = {
  [SET_LOGGING_IN](state, loggingIn: boolean) {
    state.loggingIn = loggingIn;
  },
  [SET_LOGIN_STATUS](state, message: string) {
    state.loginStatus = message;
  },
  [SET_BUTTON_STATE](state, btnState: AuthButtonState) {
    state.buttonState = {
      ...state.buttonState,
      ...btnState,
    };
  },
  [RETRY_BUTTON_ACTIVE](state) {
    state.buttonState = {
      shown: true,
      text: 'Retry',
      link: redditAuthUrl,
    };
  },
  [CONTINUE_BUTTON_ACTIVE](state) {
    state.buttonState = {
      shown: true,
      text: 'Continue',
      link: '/app',
    };
  },
  [SET_CURRENT_USER](state, user: LocalUser) {
    state.currentUser = user;
    localStorage.setItem('currentUser', user.name);
    console.log(`Current user is ${state.currentUser.name}`);
  },
  [SET_USERS_LIST](state, users: LocalUser[]) {
    state.users = users;
  },
};

export default authMutations;
