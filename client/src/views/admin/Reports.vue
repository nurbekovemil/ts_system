<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>Сделки</v-tab>
      <v-tab>Отчет по структуре комисс</v-tab>
      <v-tab>Отчет по комисс. по сборам</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <deal-reports />
      </v-tab-item>
      <v-tab-item>
        <commission-report />
      </v-tab-item>
      <v-tab-item>
        <commission-report-detail />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import CommissionReport from "../../components/admin/Reports/CommissionReport.vue";
import CommissionReportDetail from "../../components/admin/Reports/CommissionReportDetail.vue";
import DealReports from "../../components/admin/Reports/DealReports.vue";
export default {
  data: () => ({
    tab: 0,
  }),
  components: { DealReports, CommissionReport, CommissionReportDetail },
};
</script>

<style>
</style>