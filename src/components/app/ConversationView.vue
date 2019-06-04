<template>
  <div class="conversation-view-parent">
    <v-toolbar flat>
      <v-toolbar-title class="headline">
        <span>Subject {{$route.params.conversation}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat>
        <v-icon title="Jump to top">call_made</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card
      v-for="message in messages"
      :key="message.id"
      class="mb-2 conversation-message">
      <v-card-title class="pb-0">
          <v-layout>
            <v-flex xs11 align-self-center>
              <h2 class="mb-0">/u/{{message.correspondent}}</h2>
            </v-flex>
            <v-flex align-self-center>
              <v-btn flat color="orange" title="Reply"><v-icon>reply</v-icon></v-btn>  
            </v-flex>           
          </v-layout>
      </v-card-title>

      <v-card-text class="pt-0">{{ message.body }}</v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {LocalMessage} from '@/types/Types';
export default Vue.extend({
  props: {
    messages: {
      type: Array as () => LocalMessage[],
    },
  },
  computed: {
    correspondent(): string {
      return this.$route.params.conversation;
    },
  },

  mounted() {
    /* TODO: This doesn't scroll to the bottom if you open a conversation, scroll up so the last
     message is no longer visible, then switch to another conversation. */
    this.$vuetify.goTo('.conversation-message:last-of-type', {
      easing: 'easeInOutCubic',
      container: '.conversation-view-parent',
      offset: 500,
      duration: 500,
    });
  },
});
</script>


<style>

</style>
