import { LocalMessage, LocalUser } from './types/Types';
import faker from 'faker';

export function filterToNewestMessageOfConversation(allMessages: LocalMessage[]) {
  const seen = mapMessagesToMap(allMessages);
  return [...seen.values()].reverse();
}

export function mapMessagesToMap(allMessages: LocalMessage[]) {
  const seen = new Map<string, LocalMessage>();
  for (const msg of allMessages) {
      if (!seen.get(msg.firstMessageName)) {
        seen.set(msg.firstMessageName, msg);
      }
  }

  return seen;
}

export function generateConversations(numConversations: number, messagesPerConversation: number = 10) {
  const allMessages: LocalMessage[] = [];
  const authors: LocalUser[] = [
    {
      accessToken: 'test',
      id: 'abcdef',
      name: 'author1',
      tokenExpirationDate: 0,
      refreshToken: 'test2',
    },
    {
      accessToken: 'test',
      id: 'efghi',
      name: 'author2',
      tokenExpirationDate: 0,
      refreshToken: 'test2',
    },
  ];
  const owner = authors[0];

  for (let i = 0; i < numConversations; i++) {
    const firstMessageName = faker.random.alphaNumeric(6);
    let initialDate = new Date();
    const author = faker.random.arrayElement(authors);
    const dest = faker.random.arrayElement(authors);

    for (let j = 0; j < messagesPerConversation; j++) {
      const thisMessageName = (j === 0) ? firstMessageName : faker.random.alphaNumeric(6);
      const from = author === owner ? 'sent' : 'inbox';

      allMessages.push({
        author: author.name,
        dest: dest.name,
        body: `${j} ${(j === messagesPerConversation - 1) ? 'last' : ''}`,
        createdUtc: initialDate.getTime(),
        firstMessageName,
        from,
        id: `t4_${thisMessageName}_${from}`,
        isNew: faker.random.boolean(),
        name: `t4_${thisMessageName}`,
        owner: owner.id,
        subject: j + '',
      });

      initialDate = new Date(initialDate.getTime() + 150_000_000);
    }
  }

  return allMessages;
}
