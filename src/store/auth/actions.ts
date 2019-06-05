
import snoowrap from 'snoowrap';
import { TokenRetrievalResponse, LocalUser } from '@/types/Types';
import { userCollection, databaseReady } from '@/persistence/InboxDatabase';
import { ActionTree } from 'vuex';
import { AuthState, clientId, userAgent } from './state';
import { RootState } from '@/store';

const authActions: ActionTree<AuthState, RootState> =  {
  async appFirstLoaded({commit, dispatch}) {
    await databaseReady;

    const lastUser = localStorage.getItem('currentUser');
    if (!lastUser) { return; }
    const userInfo = userCollection.findOne({name: lastUser});
    if (!userInfo) { return; }

    commit('setCurrentUser', userInfo);

    dispatch('pollDatabaseForChanges');
    setInterval(() => dispatch('pollDatabaseForChanges'), 10000);
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
  /**
   * Checks database to make sure the store matches the database wherever possible. Can be called on
   *  its own to force an update, but automatically updates periodically.
   */
  async pollDatabaseForChanges({dispatch}) {
    dispatch('updateUsers');
  },
  async updateUsers({commit}) {
      commit('setUsersList', userCollection.find());
  },
};
export default authActions;
