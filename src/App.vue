<template>
  <div class="app">
    <v-app dark>
      <main-toolbar/>

      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MainToolbar from './components/MainToolbar.vue';

export default Vue.extend({
  name: 'App',
  components: {
    MainToolbar,
  },
  mounted() {
    this.$store.dispatch('auth/appFirstLoaded');
  },
});
</script>

<style lang="scss">
  .app {
  }
</style>
