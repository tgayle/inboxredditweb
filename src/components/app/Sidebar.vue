<template>
  <v-navigation-drawer permanent>
    <v-list dense class="pt-0">
      <v-list-tile
        v-for="item in options"
        :key="item.title"
        :to="{name: 'messageswhere', params: {where: item.title.toLowerCase()}}"
        @click="() => {}">

        <v-icon class="mr-2">{{ item.icon }}</v-icon>

        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      options: [
        {
          title: 'Inbox',
          icon: 'inbox',
        },
        {
          title: 'Unread',
          icon: 'fiber_new',
        },
        {
          title: 'Sent',
          icon: 'call_made',
        },
      ],
    };
  },
});
</script>


<style>

</style>
