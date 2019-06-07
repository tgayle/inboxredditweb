<template>
  <v-toolbar app>
    <v-toolbar-title class="headline">
      <span>Inbox</span>
    </v-toolbar-title>

    <span 
      v-if="currentUser" 
      :title="formatDate(messagesLastRefreshed)"
      class="ml-2">Last refresh: {{messagesLastRefreshedPretty}}</span>
    <v-spacer></v-spacer>

    <v-toolbar-items v-if="currentUser">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat v-on="on" @click="$store.dispatch('app/messages/refreshMessages')">
            <transition>
              <v-progress-circular v-if="refreshing" indeterminate></v-progress-circular>
              <v-icon v-else>refresh</v-icon>
            </transition>
          </v-btn>
        </template>
        <span>Refresh messages</span>
      </v-tooltip>
    </v-toolbar-items>
    <v-menu bottom left offset-y v-if="currentUser">
      <template v-slot:activator="{ on }">
        <v-btn
          dark
          flat
          v-on="on"
          class="text-none"
        >
          {{currentUser.name}} <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-tile
          v-for="user in users"
          :key="user.id"
          @click="userClicked(user)"
        >
          <v-list-tile-title>{{ user.name }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          @click="addAccountPressed">
          <v-list-tile-title>Add account</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { LocalUser } from '../types/Types';

import moment from 'moment';
export default Vue.extend({
  computed: {
    ...mapState('auth', ['users', 'currentUser', 'redditAuthUrl']),
    ...mapState('app/messages', ['messagesLastRefreshed', 'refreshing']),
    ...mapGetters('app/messages', ['messagesLastRefreshedPretty']),
  },
  watch: {

  },
  methods: {
    userClicked(user: LocalUser) {
      console.log(`Toolbar user clicked: ${user.name}`);
      this.$store.dispatch('auth/switchUser', user.name);
    },
    addAccountPressed() {
      window.location.href = this.redditAuthUrl;
    },
    formatDate(date: Date) {
      return moment(date).format();
    },
  },
});
</script>


<style>

</style>
