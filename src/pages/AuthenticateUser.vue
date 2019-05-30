<template>
  <div class="text-xs-center">
    <v-dialog
      :value="true"
      persistent
      width="500">

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Logging in
        </v-card-title>

        <v-progress-linear 
          :indeterminate="true"
          v-if="loggingIn"
          class="mt-0 mb-0">
        </v-progress-linear>

        <v-card-text>
          {{loginStatus}}
        </v-card-text>

        <template v-if="buttonState.shown">
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              :href="buttonState.link"
              v-if="buttonState.text === 'Retry'">
              {{buttonState.text}}
            </v-btn>

            <v-btn
              color="primary"
              flat
              :to="buttonState.link"
              v-else>
              {{buttonState.text}}
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
export default Vue.extend({
  mounted() {
    this.loginUser(this.$route.query);
  },
  computed: {
    ...mapState('auth', [
      'buttonState',
      'loginStatus',
      'loggingIn',
      ]),
  },
  methods: mapActions('auth', ['loginUser']),
});
</script>


<style>

</style>
