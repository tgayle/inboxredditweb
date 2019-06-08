
import snoowrap from 'snoowrap';
import { TokenRetrievalResponse, LocalUser } from '@/types/Types';
import { userCollection, databaseReady } from '@/persistence/InboxDatabase';
import { ActionTree } from 'vuex';
import { AuthState, clientId, userAgent } from './state';
import { RootState } from '@/store';
import { SET_USERS_LIST, RETRY_BUTTON_ACTIVE, SET_LOGIN_STATUS,
         SET_LOGGING_IN, CONTINUE_BUTTON_ACTIVE, SET_CURRENT_USER } from './mutations';

export const APP_FIRST_LOAD = 'appFirstLoaded';
export const SWITCH_USER = 'switchUser';
export const LOGIN_USER = 'loginUser';
export const POLL_DB_FOR_CHANGES = 'pollDatabaseForChanges';
export const UPDATE_USERS = 'updateUsers';

const authActions: ActionTree<AuthState, RootState> =  {
  async [APP_FIRST_LOAD]({commit, dispatch}) {
    await databaseReady;

    const lastUser = localStorage.getItem('currentUser');
    if (!lastUser) { return; }
    const userInfo = userCollection.findOne({name: lastUser});
    if (!userInfo) { return; }

    commit(SET_CURRENT_USER, userInfo);

    dispatch(POLL_DB_FOR_CHANGES);
    dispatch('app/messages/beginPeriodicUpdates', undefined, {root: true});
    setInterval(() => dispatch(POLL_DB_FOR_CHANGES), 10000);
  },
  async [SWITCH_USER]({commit, dispatch}, username?: string) {
    if (!username) {return; }

    const userInfo = userCollection.findOne({name: username});
    if (!userInfo) {
      console.log('Tried to switch to a user that doesn\'t exist?:', username);
    } else {
      commit(SET_CURRENT_USER, userInfo);
      dispatch('app/messages/update', undefined, {root: true});
    }
  },
  async [LOGIN_USER]({commit, rootState}, routeQueries: TokenRetrievalResponse) {
    commit(SET_LOGGING_IN, true);
    if (routeQueries.error) {
      commit(SET_LOGGING_IN, false);
      commit(RETRY_BUTTON_ACTIVE);
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

         commit(SET_LOGGING_IN, false);
         commit(SET_LOGIN_STATUS, `Success! Hello /u/${userInfo.name}`);
         commit(CONTINUE_BUTTON_ACTIVE);
         commit(SET_CURRENT_USER, currentUser);
        });
      } catch (e) {
        const errorMessage = e.message; // TODO: Prettify error message.
        commit(SET_LOGGING_IN, false);
        commit(SET_LOGIN_STATUS, errorMessage);
        commit(RETRY_BUTTON_ACTIVE);
      }
    }
  },
  /**
   * Checks database to make sure the store matches the database wherever possible. Can be called on
   *  its own to force an update, but automatically updates periodically.
   */
  async [POLL_DB_FOR_CHANGES]({dispatch}) {
    dispatch(UPDATE_USERS);
  },
  async [UPDATE_USERS]({commit}) {
      commit(SET_USERS_LIST, userCollection.find());
  },
};
export default authActions;
