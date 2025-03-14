<template>
  <div>
    <v-app>
      <v-main>
        <router-view/>
      </v-main>
    </v-app>
    <message/>
  </div>
</template>

<script>

import {mapActions} from 'vuex'
import Message from "./components/Message.vue";

export default {
  name: 'App',
  components: {
    Message
  },
  mounted() {
    this.GET_ME()
    this.GET_COUNT_UNREAD_NOTIFICATIONS()
  },
  methods: {
    ...mapActions('user',['GET_ME']),
    ...mapActions('notification',['GET_COUNT_UNREAD_NOTIFICATIONS']),
  
  }
};
</script>