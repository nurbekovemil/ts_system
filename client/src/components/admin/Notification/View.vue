<template>
    <v-row>
  <v-dialog v-model="isViewDialog" persistent max-width="40%">
    <v-card>
      <v-card-title class="mb-3">
        {{ notification.title }}
      </v-card-title>
      <v-card-subtitle>
        <span>Отправитель: {{ notification.user_from_company }}</span>
        <br />
        <span>Получатель: {{ notification.user_to_company }}</span>
        <br />
        <span>Дата: {{ notification.created_at }}</span>
      </v-card-subtitle>
      <v-card-text>
        <div id="notification" class="quillWrapper">
          <div class="ql-container ql-snow">
            <div class="ql-editor" v-html="notification.content"></div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
            <v-btn
              color="error"
              dark
              small
              plain
              elevation="0"
              @click="closeViewDialog"
            >
              Закрыть
            </v-btn>
            <v-spacer />
            <v-btn elevation="0" color="#78C3CC" dark small @click="print">
              <v-icon left>mdi-printer</v-icon>
              Печать</v-btn
            >
          </v-card-actions>
    </v-card>
  </v-dialog>
</v-row>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex/dist/vuex.common.js";

export default {
  data: () => ({
    
  }),
  computed: {
    ...mapState("notification", ["notification","isViewDialog"]),
  },
  methods: {
    ...mapMutations("notification", ["SET_IS_VIEW_DIALOG"]),
    closeViewDialog() {
      this.SET_IS_VIEW_DIALOG()
    },
    async print() {
      const cssOptions = {
        styles: ["quill/dist/quill.snow.css","../../../assets/vue2-editor.scss"],
      };
      await this.$htmlToPaper("notification", cssOptions);
    },
  },
};
</script>
<style src="quill/dist/quill.snow.css"></style>
<style src="../../../assets/vue2-editor.scss" lang="scss"></style>