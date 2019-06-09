import { shallowMount } from '@vue/test-utils';
import ConversationView from '@/components/app/ConversationView.vue';
import { LocalMessage } from '@/types/Types';
import { testMessage, testMessageOwners, mocks, localVue } from '../shared';

describe('ConversationView.vue', () => {
  it('correctly retrives username from id', () => {
    const wrapper = shallowMount(ConversationView, {
      propsData: { messages: [testMessage] },
      mocks,
      localVue,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    expect(wrapper.find('h2').text()).toMatch('/u/owner1');
  });

  it('retrieves the correct correspondent when the message owner is the destination', () => {
    const modifiedMessage: LocalMessage = {
      ...testMessage,
      author: 'evan',
      dest: 'owner1',
    };

    const wrapper = shallowMount(ConversationView, {
      propsData: { messages: [modifiedMessage] },
      mocks,
      localVue,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    const subheaderText = wrapper.find('.subheading').text();
    expect(subheaderText).toMatch('/u/evan');
  });

  it('retrieves the correct correspondent when the message owner is the author', () => {
    const wrapper = shallowMount(ConversationView, {
      propsData: { messages: [testMessage] },
      mocks,
      localVue,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    const subheaderText = wrapper.find('.subheading').text();
    expect(subheaderText).toMatch('/u/evan');
  });
});
