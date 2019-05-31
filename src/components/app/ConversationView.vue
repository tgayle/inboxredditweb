<template>
  <div>
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

    <template
      v-for="i in 30"
      @click="() => {}">
      <div
        :key="i">
        <v-card>
          <v-card-text class="mb-0 pb-0">{{i % 2 == 0 ? `/u/${correspondent}` : '/u/you'}}</v-card-text>
          <v-card-text class="mb-0 pt-0 pb-1">Jan 1, 1970</v-card-text>
          <v-card-text class="mb-0 pt-0 pb-1">{{lorem}}</v-card-text>
        </v-card>
        <v-divider />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  computed: {
    correspondent(): string {
      return this.$route.params.conversation;
    },
    lorem() {
      let str = '';
      for (let i = 0; i < 25; i++) {
        str += 'Lorem ipsum dolor sit amet. ';
      }
      return str;
    },
  },
});
</script>


<style>

</style>
