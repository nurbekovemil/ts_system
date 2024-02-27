<template>
  <div>
    <v-row class="mt-2">
      <v-col cols="12" md="2">
        <v-text-field
          v-model="date_from"
          label="Период с"
          type="date"
          outlined
          dense
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="date_to"
          label="По"
          type="date"
          outlined
          dense
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="8" class="d-flex align-center">
        <v-spacer />
        <v-btn
          elevation="0"
          color="#78C3CC"
          class="mr-2"
          dark
          small
          @click="getReportByDate"
        >
          <v-icon left>mdi-filter</v-icon>
          Применить</v-btn
        >
        <v-btn elevation="0" color="#78C3CC" dark small @click="print">
          <v-icon left>mdi-printer</v-icon>
          Печать</v-btn
        >
      </v-col>
    </v-row>
    <v-card>
      <div id="commission_report">
        <div class="print-logo">
          <table class="tg" style="width: 100%">
            <thead>
              <tr>
                <th style="width: 10%">
                  <img
                    width="100px"
                    alt="logo"
                    src="../../../assets/logo.png"
                  />
                </th>
                <th class="tg-baqh" colspan="3">
                  <div style="font-weight: normal">
                    <div>
                      <i>Кыргызская Фондовая Биржа</i>
                    </div>
                    <div>
                      <i>Кыргыз Фондулук Биржасы</i>
                    </div>
                    <div><i>Kyrgyz Stock Exchange</i></div>
                  </div>
                  <hr style="margin-bottom: 10px; margin-top: 10px" />
                  <h1>Отчет по структуре комиссионного сбора</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tg-0lax" colspan="4" style="border: none">
                  Период с: {{ date_from }} по: {{ date_to }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <v-simple-table class="table">
          <template v-slot:default>
            <thead>
              <tr class="brdr">
                <th class="text-left">Участник торгов</th>
                <th class="text-left">Объем сделок</th>
                <th class="text-left">Сумма комиссионных</th>
                <th class="text-left">Число сделок</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="commission_reports.length > 0">
                <tr
                  v-for="report in commission_reports"
                  :key="report.id"
                  class="brdr"
                >
                  <td>{{ report.username }}</td>
                  <td>{{ validPrice(report.costs) }} сом</td>
                  <td>{{ validPrice(report.precent) }} сом</td>
                  <td>{{ report.deal_count }}</td>
                </tr>
                <tr class="grey lighten-2">
                  <td colspan="1">
                    <b>Итого</b>
                  </td>
                  <td>
                    <b>{{ dealResults("costs") }} сом </b>
                  </td>
                  <td>
                    <b>{{ dealResults("precent") }} сом </b>
                  </td>
                  <td>
                    <!-- <b>{{ dealResults("deal_count") }} </b> -->
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
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    date_from: "",
    date_to: "",
  }),
  methods: {
    ...mapActions("report", ["GET_COMMISSION_REPORT"]),
    dealResults(field) {
      console.log(this.commission_reports);
      let total = this.commission_reports.reduce(
        (counter, deal) => (counter += parseInt(deal[field])),
        0
      );
      return this.validPrice(total);
    },
    validPrice(number) {
      return new Intl.NumberFormat("ru", { style: "decimal" }).format(number);
    },
    getReportByDate() {
      this.GET_COMMISSION_REPORT({
        date_from: this.date_from,
        date_to: this.date_to,
      });
    },
    async print() {
      const cssOptions = {
        styles: ["../../Print.css"],
      };
      await this.$htmlToPaper("commission_report", cssOptions);
    },
  },
  computed: {
    ...mapState("report", ["commission_reports"]),
  },
  mounted() {
    this.GET_COMMISSION_REPORT({
      date_from: this.date_from,
      date_to: this.date_to,
    });
  },
};
</script>

<style>
.print-logo {
  display: none !important;
}
</style>