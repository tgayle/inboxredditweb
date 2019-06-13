<template>
  <div class="app">
    <v-app :dark="darkModeEnabled">
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
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'App',
  components: {
    MainToolbar,
  },
  computed: {
    ...mapState('app', ['darkModeEnabled']),
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
