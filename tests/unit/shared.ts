import { LocalMessage, LocalUser } from '@/types/Types';
import { createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

export const testUser: LocalUser = {
  accessToken: 'access',
  id: 'someid',
  name: 'test',
  refreshToken: 'refresh',
  tokenExpirationDate: 0,
};

export const testMessage: LocalMessage =  {
  author: 'owner1',
  dest: 'evan',
  body: 'Body',
  createdUtc: 0,
  firstMessageName: 't4_a1b2c3',
  from: 'inbox',
  id: 't4_0d0e0f_inbox',
  name: 't4_0d0e0f',
  isNew: false,
  owner: 'abcdef',
  subject: 'Test',
};


export const testMessageOwners: {[key: string]: string} = {
  abcdef: 'owner1',
};

export const mocks = {
  $vuetify: {
    goTo() {
      // noop
    },
  },
};

export const localVue = createLocalVue();
localVue.use(Vuetify);
