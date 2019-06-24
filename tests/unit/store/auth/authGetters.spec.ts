import snoowrap from 'snoowrap';

import getters from '@/store/auth/getters';
import {testUser} from '../../shared';
import { AuthState } from '@/store/auth/state';

const state: AuthState = {
  buttonState: {link: '', shown: false, text: 'Retry'},
  loggingIn: false,
  loginStatus: 'Yes',
  redditAuthUrl: 'https://google.com',
  users: [testUser],
};


describe('Auth Module Getters', () => {
  it('Returns the username given an id', () => {
    expect(getters.nameFromId(state)(testUser.id)).toMatch(testUser.name);
  });

  it('Returns a snoowrap instance when a user is present', () => {
    const snoo = getters.snoowrap({
      ...state,
      currentUser: testUser,
    });

    expect(snoo).toBeInstanceOf(snoowrap);
  });

  it('Returns an undefined snoowrap instance when there is no current user.', () => {
    expect(getters.snoowrap(state)).toBeUndefined();
  });
});
