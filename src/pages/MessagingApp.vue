<template>
  <v-container fluid fill-height class="pa-0 prevent--overflow--scroll">
    <v-layout row>
      <v-flex xs2 lg1>
      <sidebar class="prevent--overflow--scroll"/>
      </v-flex>
      <v-divider vertical/>

      <v-flex xs3 lg2 fill-height>
      <recent-conversations class="prevent--overflow--scroll"/>
      </v-flex>
      <v-divider vertical/>

      <v-flex>
      <router-view name="masterView" class="prevent--overflow--scroll"></router-view>
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
export default Vue.extend({
  components: {
    ConversationView,
    RecentConversations,
    Sidebar,
  },
});
</script>

<style lang="scss" scoped>
  .prevent--overflow--scroll {
    max-height: calc(100vh - 64px); // Factor out toolbar height. TODO: Adjust for differnet platforms.
    overflow-y: auto;
  }
</style>
