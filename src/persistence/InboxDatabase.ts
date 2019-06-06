import loki from 'lokijs';
// tslint:disable-next-line:no-var-requires
const lokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');
import { LocalUser, LocalMessage } from '@/types/Types';
import { filterToNewestMessageOfConversation } from '@/util';

/**
 * Save the databaseReady promise resolver to a variable so that the rest of the application can wait
 * for the database to finish loading before continuing. This gets called at the end of `prepareDatabase()`
 */
let dbReadyResolver: (value?: {} | PromiseLike<{}> | undefined) => void;

export const databaseReady = new Promise((resolve) => {
  dbReadyResolver = resolve;
});

export const db = new loki('inbox.db', {
  adapter: new lokiIndexedAdapter('inbox'),
  autoload: true,
  verbose: true,
  autosaveCallback: () => console.log('Server data saved.'),
  autoloadCallback: prepareDatabase,
  autosave: true,
  autosaveInterval: 10000,
});

export let userCollection: Collection<LocalUser>;
export let messageCollection: Collection<LocalMessage>;

function prepareDatabase() {
  if (!db.getCollection('users')) {
    console.log('Created users collection');
    db.addCollection<LocalUser>('users', {
      unique: ['id'],
      indices: ['name'],
    });
  }

  if (!db.getCollection('messages')) {
    console.log('Created messages collection');
    db.addCollection<LocalMessage>('messages', {
      unique: ['id'],
      indices: ['id', 'owner', 'firstMessageName', 'createdUtc'],
    });
  }

  userCollection = db.getCollection('users');
  messageCollection = db.getCollection('messages');
  console.log(userCollection.find().length, 'users in database.');

  dbReadyResolver();
}

