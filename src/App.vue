<template>
  <div class="app">
    <v-app dark>
      <v-toolbar app>
        <v-toolbar-title class="headline">
          <span>Inbox</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          flat
          href="https://github.com/vuetifyjs/vuetify/releases/latest"
          target="_blank"
        >
          <span class="mr-2">Latest Release</span>
          <v-icon>open_in_new</v-icon>
        </v-btn>
      </v-toolbar>

      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
  .app {
  }
</style>
