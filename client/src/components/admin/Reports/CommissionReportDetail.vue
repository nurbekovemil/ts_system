<template>
  <div>
    <v-row class="mt-2 mx-2">
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
      <div id="commission_report_detail">
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
                  <h1>Отчет по комиссионным сборам</h1>
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
                <th class="text-left" width="10%">Дата</th>
                <th class="text-left">Номер сделки</th>
                <th class="text-left">Цена, сом</th>
                <th class="text-left">Название товара</th>
                <th class="text-left">Объем сделок, сом</th>
                <th class="text-left">Комисс. сбор, сом</th>
              </tr>
            </thead>

            <template v-if="sortedCommissionReports.length > 0">
              <template v-for="report in sortedCommissionReports">
                <tbody :key="report.id">
                  <tr class="brdr">
                    <td colspan="6" style="background: lightgrey; height: 30px">
                      <b>Участник торгов: {{ report.username }}</b>
                    </td>
                  </tr>
                  <tr
                    class="brdr"
                    v-for="(subrep, index) in report.deals"
                    :key="subrep.id + '' + index"
                  >
                    <td>{{ subrep.created_at }}</td>
                    <td>ТС-{{ subrep.deal_number }}</td>
                    <td>{{ validPrice(subrep.price) }}</td>
                    <td>{{ subrep.title }}</td>
                    <td>{{ validPrice(subrep.amount) }}</td>
                    <td>{{ validPrice(subrep.commission_report) }}</td>
                  </tr>
                  <tr class="brdr">
                    <td colspan="4" style="height: 30px">
                      <b>Итого по участнику: {{ report.username }}</b>
                    </td>
                    <td>
                      {{ validPrice(totalAmount(report.deals)) }}
                    </td>
                    <td>
                      {{
                        validPrice(
                          totalByField(report.deals, "commission_report")
                        )
                      }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </template>
            <template v-else>
              <td colspan="10" class="text-center py-2 text--disabled">
                Не найдено!
              </td>
            </template>
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
    ...mapActions("report", ["GET_COMMISSION_REPORT_DETAIL"]),
    // dealResults(field) {
    //   let total = this.commission_reports_detail.reduce(
    //     (counter, deal) => (counter += parseInt(deal[field])),
    //     0
    //   );
    //   return this.validPrice(total);
    // },
    validPrice(number) {
      return new Intl.NumberFormat("ru", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    },
    totalByField(lists, field) {
      let sum = 0;
      lists.forEach((element) => {
        sum += element[field];
      });
      return sum;
    },
    totalAmount(lists) {
      console.log(lists)
      let sum = 0;
      lists.forEach((element) => {
        // sum += element.price * element.amount;
        sum += element.amount;
      });
      return sum;
    },
    getReportByDate() {
      this.GET_COMMISSION_REPORT_DETAIL({
        date_from: this.date_from,
        date_to: this.date_to,
      });
    },
    async print() {
      const cssOptions = {
        styles: ["../../Print.css"],
      };
      await this.$htmlToPaper("commission_report_detail", cssOptions);
    },
  },
  computed: {
    ...mapState("report", ["commission_reports_detail"]),
    sortedCommissionReports() {
    return this.commission_reports_detail.map(report => ({
      ...report,
      deals: report.deals.sort((a, b) => {
        const dateA = new Date(a.created_at.split('.').reverse().join('-'));
        const dateB = new Date(b.created_at.split('.').reverse().join('-'));
        return dateB - dateA;
      }),
    }));
  },
  },
  mounted() {
    this.GET_COMMISSION_REPORT_DETAIL({
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