import { GetterTree } from 'vuex';
import { AuthState, clientId, userAgent } from './state';
import { RootState } from '@/store';
import snoowrap from 'snoowrap';

const authGetters: GetterTree<AuthState, RootState> = {
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
  nameFromId: (state) => (id: string) => {
    return state.users.filter((user) => user.id === id)[0];
  },
};

export default authGetters;
