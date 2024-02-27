<template>
  <v-row justify="center">
    <v-dialog v-model="isEditCatalog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Редактировать </v-card-title>
        <v-card-text
          >Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="close"> Закрыть </v-btn>
          <v-btn color="green darken-1" text> Сохранить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["item"],
  data() {},
  computed: {
    ...mapState("catalog", ["isEditCatalog"]),
  },
  mathods: {
    ...mapMutations("catalog", ["SET_IS_EDIT_DIALOG"]),
    close() {
      this.SET_IS_EDIT_DIALOG();
    },
  },
};
</script>