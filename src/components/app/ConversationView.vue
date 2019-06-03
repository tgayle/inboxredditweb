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

    <v-card
      v-for="i in 30"
      :key="i"
      class="mb-2">
      <v-card-title>
        <div>
          <div>
            <h2 class="mb-0 d-inline">/u/{{i % 2 === 0 ? 'you' : correspondent}}</h2>
            <div class="text-xs-right d-inline">
              <v-btn flat color="orange"><v-icon>reply</v-icon></v-btn>
            </div>            
          </div>
          <div> {{ lorem }} </div>
        </div>
      </v-card-title>
    </v-card>
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
