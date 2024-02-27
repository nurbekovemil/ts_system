<template>
  <v-card class="my-3">
    <v-row>
      <v-col>
        <v-row justify="center" class="py-3"> profile </v-row>
      </v-col>
    </v-row>
    <v-card-title class="d-flex justify-center">{{
      user.username
    }}</v-card-title>

    <v-card-actions class="d-flex justify-center">
      <v-btn small plain @click="closeViewUser">Закрыть</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["user"],
  data: () => ({}),
  methods: {
    closeViewUser() {
      this.$emit("viewUser");
    },
  },
};
</script>