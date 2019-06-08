import { shallowMount } from '@vue/test-utils';
import ConversationView from '@/components/app/ConversationView.vue';
import { LocalMessage } from '@/types/Types';

const testMessages: LocalMessage[] = [
  {
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
  },
];

const testMessageOwners: {[key: string]: string} = {
  abcdef: 'owner1',
};

const mocks = {
  $vuetify: {
    goTo() {
      // noop
    },
  },
};

describe('ConversationView.vue', () => {
  it('correctly retrives username from id', () => {


    const wrapper = shallowMount(ConversationView, {
      propsData: { messages: testMessages },
      mocks,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    expect(wrapper.find('h2').text()).toMatch('/u/owner1');
  });

  it('retrieves the correct correspondent', () => {
    const wrapper = shallowMount(ConversationView, {
      propsData: { messages: testMessages },
      mocks,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    expect(wrapper.find('.subheading').text()).toMatch('/u/evan');
  });
});
