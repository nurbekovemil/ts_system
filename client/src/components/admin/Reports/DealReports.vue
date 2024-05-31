<template>
  <v-card elevation="1">
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
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search_name"
          placeholder="Наименование участника"
          dense
          :disabled="!is_members"
          outlined
          :filled="!is_members"
          hide-details
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-checkbox
          class="mt-0 pt-0"
          hide-details
          v-model="is_members"
          label="Участники"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-spacer />
        <v-btn
          elevation="0"
          color="#78C3CC"
          class="mr-2"
          dark
          small
          @click="getDealReports"
        >
          <v-icon left>mdi-filter</v-icon>
          Применить</v-btn
        >
      </v-col>
    </v-row>
    <v-card-text>
      <div id="reportList">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">№ сделки</th>
                <th class="text-left">Дата заключения</th>
                <th class="text-left">Товар</th>
                <th class="text-left">Код ТНВД</th>
                <template v-if="is_members">
                  <th class="text-left">Продавец</th>
                  <th class="text-left">Покупатель</th>
                </template>
                <th class="text-left">Кол-во Товара</th>
                <th class="text-left">Ед. Измерения</th>
                <th class="text-left" width="15%">Цена</th>
                <th class="text-left" width="20%">Сумма сделки</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="deals.length > 0">
                <tr v-for="deal in deals" :key="deal.id">
                  <td>{{ deal.id }}</td>
                  <td>{{ deal.created_at }}</td>
                  <td>{{ deal.prod_title }}</td>
                  <td>{{ deal.code_tnved }}</td>
                  <template v-if="is_members">
                    <td
                      :class="
                        search_name == deal.user_from_name && 'green--text'
                      "
                    >
                      {{ deal.user_from_name }}
                    </td>
                    <td
                      :class="search_name == deal.user_to_name && 'green--text'"
                    >
                      {{ deal.user_to_name }}
                    </td>
                  </template>
                  <td>{{ deal.amount }}</td>
                  <td>{{ deal.prod_weight }}</td>
                  <td>
                    {{ validPrice(deal.price) }}
                    {{ deal.symbol }}
                  </td>
                  <td>
                    {{ validPrice(deal.cost) }}
                    {{ deal.symbol }}
                  </td>
                </tr>
                <tr class="grey lighten-2">
                  <td colspan="4">
                    <b>Итого</b>
                  </td>
                  <template v-if="is_members">
                    <td colspan="2"></td>
                  </template>
                  <td>{{ dealResults("amount") }}</td>
                  <td></td>
                  <td>{{ dealResults("price") }}</td>
                  <td>{{ dealResults("cost") }}</td>
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
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn elevation="0" color="#78C3CC" dark small @click="print">
        <v-icon left>mdi-printer</v-icon>
        Печать</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    date_from: "",
    date_to: "",
    search_name: "",
    tab: 1,
    is_members: false,
  }),
  computed: {
    ...mapState("report", ["deals"]),
  },
  methods: {
    ...mapActions("report", ["GET_DEAL_REPORTS"]),
    getDealReports() {
      this.GET_DEAL_REPORTS({
        search_name: this.search_name,
        date_from: this.date_from,
        date_to: this.date_to,
        is_members: this.is_members,
      });
    },
    validPrice(number) {
      return new Intl.NumberFormat("ru", { style: "decimal",  minimumFractionDigits: 2, 
  maximumFractionDigits: 2  }).format(number);
    },
    dealResults(field) {
      let total = this.deals.reduce(
        (counter, deal) => (counter += parseInt(deal[field])),
        0
      );
      return this.validPrice(total);
    },
    async print() {
      const cssOptions = {
        styles: ["../../Print.css"],
      };
      await this.$htmlToPaper("reportList", cssOptions);
    },
  },
  mounted() {
    this.getDealReports();
  },
  watch: {
    length(val) {
      this.tab = val - 1;
    },
  },
};
</script>

<style>
</style>