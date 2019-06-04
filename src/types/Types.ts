
/**
 * TS declarations don't include the actual snoowrap class objects, so store these here for checking
 * types with `instanceof`.
 */
// // @ts-ignore
// export const RemotePrivateMessage = snoowrap.objects.PrivateMessage;
// // @ts-ignore
// export const RemoteComment = snoowrap.objects.PrivateMessage;

// export type IRemotePrivateMessage = snoowrap.PrivateMessage;

/**
 * Since users can send themselves messages, keep track of whether
 * we got a message from inbox or sent so we don't accidentally
 * remove duplicate messages.
 */
export type SourceInbox = 'sent' | 'inbox';

export interface LocalMessage {
  id: string;
  owner: LocalUser;
  author: string;
  dest: string;
  body: string;
  subject: string;
  createdUtc: number;

  firstMessageName: string;
  name: string;
  isNew: boolean;

  from: SourceInbox;
}

export interface LocalUser {
  id: string;
  name: string;
  accessToken: string;
  tokenExpirationDate: number;
  refreshToken: string;
}
export interface TokenRetrievalResponse {
  error?: string;
  code: string;
  state: string;
}
