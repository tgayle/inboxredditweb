<template>
  <div>
    <v-container>
      <v-card>
        <v-responsive class="pa-2">
          <h1 class="font-weight-thin display-3">Welcome to Inbox</h1>
          <v-card-text>
            Inbox is an unofficial messaging client for Reddit.
          </v-card-text>
          <ul>
            <li>Safe
              <ul>
                <li>Inbox runs entirely in your browser.</li>
              </ul>
            </li>
            <li>Pretty
              <ul>
                <li>Skip the hard-to-use interface on Reddit. Inbox is easy to use.</li>
              </ul>
            </li>
            <li>Functionality
              <ul>
                <li>Inbox has features to enhance your Reddit messaging experience.</li>
                <li>Draft saving</li>
                <li>Favorite the people you're messaging most</li>
                <li>Save, filter, and export your messages</li>
              </ul>
            </li>
          </ul>

          <v-card-text>
            To get started, <a :href="redditAuthUrl">sign in with Reddit.</a>
          </v-card-text>
          
        </v-responsive>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
export default Vue.extend({
  computed: {
    ...mapState('auth', ['redditAuthUrl']),
  },
});
</script>


<style>

</style>
