import { shallowMount, createLocalVue } from '@vue/test-utils';
import RecentConversations from '@/components/app/RecentConversations.vue';
import { testMessage, testMessageOwners, localVue } from '../shared';
import { LocalMessage } from '@/types/Types';

const propsData = {
  conversations: [testMessage],
  loadingBar: false,
};

const mocks = {
  $route: {
    params: {
      where: 'inbox',
    },
  },
};



describe('RecentConversations.vue', () => {
  it('shows the loading bar when prop is true', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData: { ...propsData, loadingBar: true },
      mocks,
      localVue,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    expect(wrapper.props().loadingBar).toBeTruthy();
    expect(wrapper.find({name: 'v-progress-linear'}).exists()).toBeTruthy();
  });

  it('does not show the loading bar when prop is false', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData,
      mocks,
      localVue,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    expect(wrapper.find({name: 'v-progress-linear'}).exists()).toBeFalsy();
  });

  it('retrieves the correct correspondent when the message owner is the destination', () => {
    const modifiedMessage: LocalMessage = {
      ...testMessage,
      author: 'evan',
      dest: 'owner1',
    };

    const wrapper = shallowMount(RecentConversations, {
      propsData: { conversations: [modifiedMessage] },
      mocks,
      localVue,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    const correspondentText = wrapper.find('span.text--primary').text();
    expect(correspondentText).toMatch('/u/evan');
  });

  it('retrieves the correct correspondent when the message owner is the author', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData: { conversations: [testMessage] },
      mocks,
      localVue,
      computed: {
        nameFromId: () => (id: string) => {
          return testMessageOwners[id];
        },
      },
    });

    const correspondentText = wrapper.find('.text--primary').text();
    expect(correspondentText).toMatch('/u/evan');
  });
});
