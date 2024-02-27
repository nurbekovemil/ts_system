<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-if="GET_MESSAGE"
      v-model="GET_MESSAGE.isAlert"
      :timeout="timeout"
      :color="GET_MESSAGE.color"
    >
      <template>
        <v-icon>{{ GET_MESSAGE.icon }}</v-icon>
        {{ GET_MESSAGE.text }}
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    timeout: 4000,
  }),
  computed: {
    ...mapGetters("message", ["GET_MESSAGE"]),
  },
};
</script>