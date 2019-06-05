import { GetterTree } from 'vuex';
import { AuthState, clientId, userAgent } from './state';
import { RootState } from '@/store';
import snoowrap from 'snoowrap';

const authGetters: GetterTree<AuthState, RootState> = {
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
  nameFromId: (state) => (id: string) => {
    return state.users.filter((user) => user.id === id)[0];
  },
};

export default authGetters;
