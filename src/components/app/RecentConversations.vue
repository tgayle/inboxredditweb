<template>
  <div>
    <v-progress-linear class="ma-0 pa-0" indeterminate v-if="loadingBar"/>
    <v-list two-line>
      <v-list-tile
        :key="convo.id"
        v-for="convo in conversations"
        :to="{name: 'viewconversation', params: {conversation: convo.firstMessageName, where: $route.params.where}}"
        @click="$emit('conversation-click', convo.firstMessageName, $event)">
          <v-list-tile-content>
            <v-list-tile-title>
              <div class="recentconversation--grid">
                  <p class="recentconversation--subject recentconversation--grid--subject">{{convo.subject}}</p>
                <div class="recentconversation--grid--sentreceived">
                  <v-icon class="">{{wasMe(convo) ? 'call_made' : 'call_received'}}</v-icon> 
                </div>
              </div>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <span class='text--primary'>/u/{{correspondent(convo)}}</span> &mdash; {{convo.body}}
            </v-list-tile-sub-title>
          </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LocalMessage } from '../../types/Types';
import { mapGetters } from 'vuex';
export default Vue.extend({
  props: {
    loadingBar: {
      type: Boolean,
    },
    conversations: {
      type: Array as () => LocalMessage[],
    },
  },
  methods: {
    wasMe(conversation: LocalMessage) {
      return this.nameFromId(conversation.owner) === conversation.author;
    },
    correspondent(conversation: LocalMessage) {
      return this.nameFromId(conversation.owner) === conversation.author ? conversation.dest : conversation.author;
    },
  },
  computed: {
    ...mapGetters('auth', ['nameFromId']),
  },
});
</script>


<style lang="scss">

.recentconversation {
  &--subject {
    text-overflow: ellipsis;
  }

  &--grid {
    display: grid;
    grid-template-columns: [main] 9fr [meta] 1fr;
    grid-template-rows: [subject] 1fr;

    &--subject {
      grid-column-start: main;
      grid-row-start: subject;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &--sentreceived {
      grid-column-start: meta;
      grid-row-start: subject;
    }
  }
}


</style>
