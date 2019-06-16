import { shallowMount } from '@vue/test-utils';
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

const computed = {
  nameFromId: () => (id: string) => {
    return testMessageOwners[id];
  },
};

describe('RecentConversations.vue', () => {
  it('shows the loading bar when prop is true', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData: { ...propsData, loadingBar: true },
      mocks,
      localVue,
      computed,
    });

    expect(wrapper.props().loadingBar).toBeTruthy();
    expect(wrapper.find({name: 'v-progress-linear'}).exists()).toBeTruthy();
  });

  it('does not show the loading bar when prop is false', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData,
      mocks,
      localVue,
      computed,
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
      computed,
    });

    const correspondentText = wrapper.find('p.recentconversation--grid--correspondent').text();
    expect(correspondentText).toMatch('/u/evan');
  });

  it('retrieves the correct correspondent when the message owner is the author', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData: { conversations: [testMessage] },
      mocks,
      localVue,
      computed,
    });

    const correspondentText = wrapper.find('p.recentconversation--grid--correspondent').text();
    expect(correspondentText).toMatch('/u/evan');
  });

  it('changes sent-received icon direction when last message was received', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData: { conversations: [{
        ...testMessage,
        author: 'someotherauthor',
      }],
      },
      mocks,
      localVue,
      computed,
    });

    const icon = wrapper.find('.recentconversation--grid--sentreceivedicon');
    expect(icon.text()).toMatch('call_received');
  });

  it('changes sent-received icon direction when last message was sent', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData: { conversations: [{
        ...testMessage,
      }],
      },
      mocks,
      localVue,
      computed,
    });

    const icon = wrapper.find('.recentconversation--grid--sentreceivedicon');
    expect(icon.text()).toMatch('call_made');
  });

  it('boldens correspondent and subject lines when message is unread', () => {
    const wrapper = shallowMount(RecentConversations, {
      propsData: { conversations: [{
        ...testMessage,
        isNew: true,
      }],
      },
      mocks,
      localVue,
      computed,
    });

    const correspondentText = wrapper.find('p.recentconversation--grid--correspondent');
    const subjectText = wrapper.find('p.recentconversation--subject');

    expect(correspondentText.classes('font-weight-bold')).toBe(true);
    expect(subjectText.classes('font-weight-bold')).toBe(true);
  });
});
