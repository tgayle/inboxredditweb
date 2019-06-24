import { GetterTree } from 'vuex';
import { AuthState, clientId, userAgent } from './state';
import { RootState } from '@/store';
import snoowrap from 'snoowrap';

// Added for better type inference.
interface AuthGetters {
  snoowrap(state: AuthState): snoowrap | undefined;
  nameFromId(state: AuthState): (id: string) => string;
}

const authGetters: GetterTree<AuthState, RootState> & AuthGetters = {
  snoowrap(state) {
    if (state.currentUser) {
      const snoo = new snoowrap({
        accessToken: state.currentUser.accessToken,
        refreshToken: state.currentUser.refreshToken,
        clientId,
        userAgent,
      });

      /*
      Disable proxies for snoowrap instances since vue's reactivity triggers
      a random reddit request that fills the console with errors.
      https://github.com/not-an-aardvark/snoowrap/issues/177
      */
      snoo.config({proxies: false});

      return snoo;
    }
    return undefined;
  },
  nameFromId(state) {
    return (id: string) => state.users.filter((user) => user.id === id)[0].name;
  },
};

export default authGetters;
