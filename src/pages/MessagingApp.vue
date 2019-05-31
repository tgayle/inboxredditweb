<template>
  <v-container fluid fill-height class="pa-0">
    <v-layout row>
      <v-flex xs2 lg1>
      <sidebar />
      </v-flex>
      <v-divider vertical/>

      <v-flex xs3 lg2 fill-height>
      <recent-conversations class="prevent--overflow--scroll"/>
      </v-flex>
      <v-divider vertical/>

      <v-flex>
      <router-view name="masterView"></router-view>
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
    // height: 100%;
    max-height: calc(100vh - 64px);
    overflow-y: auto;
  }
</style>
