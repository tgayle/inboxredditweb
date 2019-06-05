import { MutationTree } from 'vuex';
import { AuthState, AuthButtonState, redditAuthUrl } from './state';
import { LocalUser } from '@/types/Types';

const authMutations: MutationTree<AuthState> = {
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
};

export default authMutations;
