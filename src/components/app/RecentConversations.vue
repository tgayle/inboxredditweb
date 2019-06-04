<template>
  <v-list two-line>
    <v-list-tile
      :key="convo.id"
      v-for="convo in conversations"
      :to="{name: 'viewconversation', params: {conversation: convo.firstMessageName, where: $route.params.where}}"
      @click="$emit('conversation-click', convo.firstMessageName, $event)">
        <v-list-tile-content>
          <v-list-tile-title>
            <v-layout>
              <v-flex xs11 align-self-center>
                {{`Subject ${convo.firstMessageName}`}}
              </v-flex>
              <v-flex align-self-center>
                <v-icon class="pl-5">{{wasMe(convo) ? 'call_made' : 'call_received'}}</v-icon> 
              </v-flex>
            </v-layout>
          </v-list-tile-title>
          <v-list-tile-sub-title>{{`Conversation message, correspondent ${correspondent(convo)}`}}</v-list-tile-sub-title>
        </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
import { LocalMessage } from '../../types/Types';
export default Vue.extend({
  props: {
    conversations: {
      type: Array as () => LocalMessage[],
    },
  },
  methods: {
    wasMe(conversation: LocalMessage) {
      return conversation.owner.name === conversation.author;
    },
    correspondent(conversation: LocalMessage) {
      return conversation.owner.name === conversation.author ? conversation.dest : conversation.author;
    },
  },
});
</script>


<style>
</style>
