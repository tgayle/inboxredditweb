<template>
  <v-toolbar app>
    <v-toolbar-title class="headline">
      <span>Inbox</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu bottom left offset-y>
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
import { mapState } from 'vuex';
import { LocalUser } from '../types/Types';
export default Vue.extend({
  computed: {
    ...mapState('auth', ['users', 'currentUser', 'redditAuthUrl']),
  },
  methods: {
    userClicked(user: LocalUser) {
      console.log(`Toolbar user clicked: ${user.name}`);
      this.$store.dispatch('auth/switchUser', user.name);
    },
    addAccountPressed() {
      window.location.href = this.redditAuthUrl;
    },
  },
});
</script>


<style>

</style>
