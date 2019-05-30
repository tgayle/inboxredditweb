<template>
  <v-container fluid fill-height class="pa-0">
    <v-layout row>
      <v-flex xs2>
      <sidebar />
      </v-flex>
      <v-divider vertical/>
      <v-flex xs3>
      <recent-conversations />
      </v-flex>
      <v-divider vertical/>
      <v-flex>
      <conversation-view />
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
</style>
