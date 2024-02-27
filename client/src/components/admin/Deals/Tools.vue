<template>
  <v-card>
    <v-card-text v-if="isComment">
      <v-textarea
        v-model="comment"
        outlined
        label="Введите комментарии"
        rows="3"
        hide-details
        class="mb-3"
      ></v-textarea>
      <v-file-input
        v-model="dealFiles"
        label="Прикрепить файл"
        outlined
        dense
      ></v-file-input>
    </v-card-text>
    <v-card-actions>
      <div class="body-2">
        Статус сделки:
        <v-chip small dark :color="deal.status_color">
          {{ deal.status_title }}
        </v-chip>
      </div>

      <v-spacer />
      <v-checkbox
        v-if="deal.status == 1 || deal.status == 5"
        v-model="isComment"
        hide-details
        label="Комментарии"
        class="ma-0 pa-0"
      ></v-checkbox>
      <template v-if="deal.own && deal.status == 1">
        <v-btn text color="orange" small @click="updateDealStatus(3)">
          <v-icon left>mdi-cancel</v-icon>
          Отклонить
        </v-btn>
      </template>
      <template v-if="!deal.own && deal.status == 1">
        <v-btn text color="orange" small @click="updateDealStatus(3)">
          <v-icon left>mdi-cancel</v-icon>
          Отклонить
        </v-btn>
        <v-btn color="success" small elevation="0" @click="updateDealStatus(5)">
          <v-icon left>mdi-check</v-icon>
          Принять на исполнение
        </v-btn>
      </template>
      <template v-if="deal.status == 5">
        <v-btn
          color="orange"
          small
          text
          elevation="0"
          @click="updateDealStatus(4)"
        >
          <v-icon left>mdi-cancel</v-icon>
          Отменить
        </v-btn>
        <v-btn color="success" small elevation="0" @click="updateDealStatus(6)">
          <v-icon left>mdi-check</v-icon>
          Исполнить
        </v-btn>
      </template>

      <template v-if="deal.own && deal.status == 3">
        <v-btn color="success" small @click="updateDealStatus(1)">
          <v-icon left>mdi-repeat</v-icon>
          Отправить повторно
        </v-btn>
      </template>
      <v-btn
        @click="print"
        v-if="deal.status == 2 || deal.status == 5 || deal.status == 6"
        color="success"
        small
      >
        <v-icon left>mdi-printer</v-icon>
        Печать
      </v-btn>
      <template v-if="user.role == 'CD' && deal.status == 6">
        <v-btn color="success" small elevation="0" @click="updateDealStatus(2)">
          <v-icon left>mdi-check</v-icon>
          Завершить
        </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["deal"],
  data: () => ({
    isComment: false,
    comment: "",
    dealFiles: [],
    deal_number: null,
  }),
  computed: {
    ...mapState("user", ["user"]),
  },
  methods: {
    ...mapActions("deal", [
      "GET_DEAL_BY_ID",
      "UPDATE_DEAL_STATUS",
      "UPDATE_DEAL_STATUS_WITH_COMMENT",
    ]),
    updateDealStatus(status) {
      if (this.isComment) {
        let formData = new FormData();
        formData.append("dealFiles", this.dealFiles);
        formData.append("status", status);
        formData.append("deal_id", this.deal.id);
        formData.append("comment", this.comment);
        this.UPDATE_DEAL_STATUS_WITH_COMMENT({
          formData,
          deal_id: this.deal.id,
        });
      } else {
        this.UPDATE_DEAL_STATUS({
          status,
          deal_id: this.deal.id,
          deal_number: this.deal_number,
        });
      }
    },
    addDealNumber() {},
    async print() {
      // Pass the element id here
      const cssOptions = {
        styles: ["../../Print.css"],
      };
      await this.$htmlToPaper("printDeal", cssOptions);
    },
  },
};
</script>

<style></style>
