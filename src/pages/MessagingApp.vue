<template>
  <v-container fluid fill-height class="pa-0 prevent--overflow--scroll">
    <v-layout row>
      <v-flex xs2 lg1>
      <sidebar class="prevent--overflow--scroll"/>
      </v-flex>
      <v-divider vertical/>

      <v-flex xs3 lg2 fill-height>
      <recent-conversations 
        class="prevent--overflow--scroll"
        :loadingBar="refreshing"
        :conversations="conversationPreviews"
        @conversation-click="conversationClicked"/>
      </v-flex>
      <v-divider vertical/>

      <v-flex xs7 lg9>
        <no-conversation v-if="!$route.params.conversation"/>
        <conversation-view 
          v-else 
          class="prevent--overflow--scroll" 
          :messages="conversationMessages" />
      </v-flex>
      <v-divider vertical/>

    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import ConversationView from '../components/app/ConversationView.vue';
import RecentConversations from '../components/app/RecentConversations.vue';
import Sidebar from '../components/app/Sidebar.vue';
import NoConversation from '../components/app/NoConversation.vue';
import { LocalMessage } from '../types/Types';

import {generateConversations, filterToNewestMessageOfConversation} from '@/util';
import { Route } from 'vue-router';
import { mapState } from 'vuex';
export default Vue.extend({
  components: {
    ConversationView,
    RecentConversations,
    Sidebar,
    NoConversation,
  },
  mounted() {
    if (this.$route.params.conversation) {
      this.$store.dispatch('app/messages/openConversation', this.$route.params.conversation);
    }
  },
  watch: {
    $route(to: Route, from: Route) {
      if (to.params.conversation !== from.params.conversation) {
        this.$store.dispatch('app/messages/openConversation', to.params.conversation);
      }
    },
  },
  computed: {
    ...mapState('app/messages', ['conversationPreviews', 'conversationMessages', 'refreshing']),
  },
  methods: {
    conversationClicked(firstMessageName: string, event: Event) {
      //
    },
  },
});
</script>

<style lang="scss" scoped>
  .prevent--overflow--scroll {
    max-height: calc(100vh - 64px); // Factor out toolbar height. TODO: Adjust for different platforms.
    overflow-y: auto;
  }
</style>
