<template>
  <div class="conversation-view-parent">
    <v-toolbar flat>
      <v-toolbar-title class="headline">
        <span>{{messages.length ? messages[0].subject : $route.params.conversation}} | </span>
        <span class='text--primary subheading'>/u/{{messages.length ? correspondent(messages[0]) : 'unknown'}}</span> 
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
              <h2 class="mb-0">/u/{{message.author}}</h2>
            </v-flex>
            <v-flex align-self-center>
              <v-btn flat title="Reply"><v-icon>reply</v-icon></v-btn>  
            </v-flex>           
          </v-layout>
      </v-card-title>

      <v-card-text class="pt-0" v-html="parseMarkdown(message.body)"> </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {LocalMessage} from '@/types/Types';
import { mapGetters } from 'vuex';
// @ts-ignore-next-line
import snuownd from 'snuownd';

export default Vue.extend({
  props: {
    messages: {
      type: Array as () => LocalMessage[],
    },
  },
  computed: {
    ...mapGetters('auth', ['nameFromId']),
  },
  methods: {
    correspondent(conversation: LocalMessage) {
      if (this.nameFromId(conversation.owner) === conversation.author) {
        return conversation.dest;
      } else {
        return conversation.author;
      }
    },
    parseMarkdown(str: string) {
      return snuownd.getParser().render(str);
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
