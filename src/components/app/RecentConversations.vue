<template>
  <v-list two-line>
    <v-list-tile
      :key="i"
      v-for="i in 15"
      :to="{name: 'viewconversation', params: {conversation: i, where: $route.params.where}}"
      @click="() => {}">
        <v-list-tile-content>
          <v-list-tile-title>{{`Subject ${i}`}}</v-list-tile-title>
          <v-list-tile-sub-title>{{`Conversation message ${i}`}}</v-list-tile-sub-title>
        </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({

});
</script>


<style>
</style>
