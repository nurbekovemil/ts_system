<template>
  <v-card>
    <v-row class="mt-2 ml-0">
      <v-col cols="12" md="12" class="d-flex align-center justify-end">
        <download-excel
          :data="reg_pays"
          :fields="json_fields"
          name="regpays.xls"
        >
          <v-btn elevation="0" color="#78C3CC" class="mr-2" dark small>
            <v-icon left>mdi-microsoft-excel</v-icon>
            Экспорт</v-btn
          >
        </download-excel>
        <v-btn
          elevation="0"
          color="#78C3CC"
          class="mr-2"
          dark
          small
          @click="openRegPayDailog"
        >
          <v-icon left>mdi-plus</v-icon>
          Добавить</v-btn
        >
      </v-col>
    </v-row>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left" width="5%">№</th>
              <th class="text-left" width="15%">Дата</th>
              <th class="text-left" width="40%">Названия оснований</th>
              <th class="text-left" width="25%">Отправитель</th>
              <th class="text-left" width="25%">Получатель</th>
              <th class="text-left" width="4%"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="reg_pays.length">
              <tr v-for="(reg, i) in reg_pays" :key="reg.id">
                <td>{{ i + 1 }}</td>
                <td>{{ reg.created_at }}</td>
                <td>{{ reg.title }}</td>
                <td>{{ reg.user_from_name }}</td>
                <td>{{ reg.user_to_name }}</td>
                <td>
                  <v-btn icon @click="deleteRegPay(reg.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template v-else>
              <td colspan="10" class="text-center py-2 text--disabled">
                Не найдено!
              </td>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>

    <reg-report-add />
  </v-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import RegReportAdd from "./RegReportAdd.vue";
import Vue from "vue";
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);

export default {
  components: { RegReportAdd },
  data: () => ({
    json_fields: {
      "№": "id",
      Дата: "created_at",
      Названия: "title",
      Отправитель: "user_from_name",
      Получатель: "user_to_name",
    },
  }),
  computed: {
    ...mapState("passport", ["reg_pays"]),
    json_regpay_data() {
      return JSON.stringify(this.reg_pays);
    },
  },
  methods: {
    ...mapMutations("passport", ["SET_IS_ADD_REG_PAY"]),
    ...mapActions("passport", ["GET_REG_PAY_ALL_LIST", "DELETE_REG_PAY_BY_ID"]),
    openRegPayDailog() {
      this.SET_IS_ADD_REG_PAY();
    },
    deleteRegPay(id) {
      this.DELETE_REG_PAY_BY_ID(id);
    },
  },
  mounted() {
    this.GET_REG_PAY_ALL_LIST();
  },
};
</script>

<style>
</style>