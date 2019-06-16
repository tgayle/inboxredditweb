<template>
  <div>
    <v-progress-linear class="ma-0 pa-0" indeterminate v-if="loadingBar"/>
    <v-card
      class="pa-2"
      :key="convo.id"
      v-for="convo in conversations"
      :to="{name: 'viewconversation', params: {conversation: convo.firstMessageName, where: $route.params.where}}"
      @click="$emit('conversation-click', convo.firstMessageName, $event)">

      <div class="recentconversation--grid">
        <p class="recentconversation--grid--correspondent ma-0 oneline" :class="unreadConversationStyles(convo)">/u/{{correspondent(convo)}}</p>
        <p class="recentconversation--subject recentconversation--grid--subject ma-0 oneline" :class="unreadConversationStyles(convo)">{{convo.subject}}</p>

        <p class="recentconversation--grid--time ma-0">{{timeAgo(convo.createdUtc)}}</p>

        <div class="recentconversation--grid--sentreceived">
          <v-icon class="recentconversation--grid--sentreceivedicon" :style="unreadSentReceivedIconStyle(convo)">{{wasMe(convo) ? 'call_made' : 'call_received'}}</v-icon> 
        </div>

        <p class="recentconversation--grid--preview ma-0 pt-0 oneline">{{convo.body}}</p>
      </div>

    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LocalMessage } from '../../types/Types';
import { mapGetters } from 'vuex';
import moment from 'moment';

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
    timeAgo(time: number) {
      return moment(time).fromNow();
    },
    unreadConversationStyles(conversation: LocalMessage) {
      if (conversation.isNew) {
        return {
          'font-weight-bold': true,
        };
      }
      return {};
    },
    unreadSentReceivedIconStyle(conversation: LocalMessage) {
      if (conversation.isNew) {
        return {
          color: this.$vuetify.theme.accent,
        };
      }
      return {};
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
    grid-template-columns: [main] 6fr [meta] 4fr;
    grid-template-rows: [correspondent] 1fr [subject] 1fr [preview] 1fr;

    &--subject {
      grid-column: main;
      grid-row-start: subject;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &--time {
      grid-column: meta;
      grid-row: correspondent;
      justify-self: end;
      max-lines: 1;
    }

    &--sentreceived {
      grid-column-start: meta;
      grid-row-start: subject;
      justify-self: end;
    }

    &--preview {
      grid-column-start: main;
      grid-column-end: span 2;
      grid-row-start: preview;
      opacity: 0.83;
    }

    &--correspondent {
      grid-column-start: main;
      grid-row: correspondent;
    }
  }

  
}

.oneline {
    max-lines: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
