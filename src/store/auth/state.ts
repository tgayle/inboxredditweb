import { LocalUser } from '@/types/Types';
import snoowrap from 'snoowrap';

export interface AuthState {
  loggingIn: boolean;
  loginStatus: string;
  buttonState: AuthButtonState;
  redditAuthUrl: string;
  currentUser?: LocalUser;

  users: LocalUser[];
}

export interface AuthButtonState {
  shown: boolean;
  text: 'Retry' | 'Continue';
  link: string;
}

export const redditAuthUrl = snoowrap.getAuthUrl({
  clientId: process.env.VUE_APP_CLIENTID as string,
  redirectUri: process.env.VUE_APP_REDIRECT as string,
  permanent: true,
  scope: ['identity', 'privatemessages', 'read', 'report'],
});

export const clientId  = process.env.VUE_APP_CLIENTID as string;
export const userAgent = process.env.VUE_APP_USERAGENT as string;

const authState: AuthState = {
  redditAuthUrl,
  loginStatus: 'This might take a moment...',
  loggingIn: false,
  buttonState: {
    shown: false,
    text: 'Retry',
    link: redditAuthUrl,
  },

  currentUser: undefined,
  users: [],
};

export default authState;
