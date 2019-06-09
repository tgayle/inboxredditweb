import * as InboxDatabase from '@/persistence/InboxDatabase';
import { LocalUser, LocalMessage } from '@/types/Types';
import { testUser } from '../shared';

const testMessage: LocalMessage = {
  id: 'someid',
  name: 'test',
  author: 'bob',
  body: 'body',
  createdUtc: 0,
  dest: 'tim',
  firstMessageName: 'firstname',
  from: 'inbox',
  isNew: false,
  owner: 'abcdef',
  subject: 'bobby',
};

describe('InboxDatabase', () => {
  afterEach(() => {
    InboxDatabase.userCollection.chain().find().remove();
    InboxDatabase.messageCollection.chain().find().remove();
  });

  it('opens the database.', async () => {
    expect(await InboxDatabase.databaseReady).toBe(true);
  });

  it('creates messages collection if it doesn\'t exist', async () => {
    expect(InboxDatabase.messageCollection).toBeTruthy();
  });

  it('creates user collection if it doesn\'t exist', async () => {
    expect(InboxDatabase.userCollection).toBeTruthy();
  });

  it('successfully inserts a user', () => {
    InboxDatabase.userCollection.insertOne(testUser);

    expect(InboxDatabase.userCollection.findOne({id: testUser.id})).toBeTruthy();
  });

  it('successfully inserts a message', () => {
    InboxDatabase.messageCollection.insertOne(testMessage);

    expect(InboxDatabase.messageCollection.findOne({id: 'someid'})).toBeTruthy();
  });

  it('creates a new document when upsert is used', () => {
    InboxDatabase.upsert(InboxDatabase.userCollection, 'id', testUser);

    const retrievedUser = InboxDatabase.userCollection.findOne({id: testUser.id});
    expect(retrievedUser).toBeTruthy();
  });

  it('updates a preexisting document when upsert is used', () => {
    const originalUser = testUser;
    InboxDatabase.userCollection.insertOne(originalUser);

    const modifiedUser: LocalUser = {
      ...testUser,
      name: 'anothername',
    };

    InboxDatabase.upsert(InboxDatabase.userCollection, 'id', modifiedUser);

    const retrievedUser = InboxDatabase.userCollection.findOne({id: originalUser.id});
    expect(retrievedUser!.name).toMatch(modifiedUser.name);
  });
});
