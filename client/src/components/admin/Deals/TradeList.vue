<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-select
        v-model="selected"
        :items="periods"
        menu-props="auto"
        item-text="title"
        item-value="date"
        label="Период"
        dense
        outlined
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="12" md="12">
      <v-simple-table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Код ТНВЭД</th>
            <th>Заявка</th>
            <th>Цена</th>
            <th>Количество</th>
            <th>Сумма</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="trade_list.length">
            <tr v-for="(trade, i) in trade_list" :key="i">
              <td>{{ trade.created_at }}</td>
              <td>{{ trade.code_tnved }}</td>
              <td>{{ trade.title }}</td>
              <td>{{ validPrice(trade.price) }} {{ trade.currency_symbol }}</td>
              <td>{{ trade.amount }} / {{ trade.weight }}</td>
              <td>{{ validPrice(trade.cost) }} {{ trade.currency_symbol }}</td>
              <td>
                <v-btn
                  rounded
                  plain
                  small
                  color="primary"
                  @click="viewDeal(trade.id)"
                >
                  Посмотреть
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-else>
            <td colspan="6" class="text-center py-2 text--disabled">
              Не найдено!
            </td>
          </template>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    selected: 1,
    periods: [
      { title: "Последние", date: 1 },
      { title: "За неделю", date: 7 },
      { title: "За месяц", date: 31 },
      { title: "Все", date: "all" },
    ],
  }),
  computed: {
    ...mapState("deal", ["trade_list"]),
    ...mapState("user", ["user"]),
  },
  methods: {
    ...mapActions("deal", ["GET_TRADE_LIST"]),
    getTradeList(v) {
      this.GET_TRADE_LIST(v);
    },
    validPrice(number) {
      return new Intl.NumberFormat("ru", { style: "decimal" }).format(number);
    },
    viewDeal(id) {
      if (this.user.role == "ADMIN" || this.user.role == "CD") {
        this.$router.push("/dashboard/deal/" + id);
      } else {
        this.$router.push("/trade/" + id);
      }
    },
  },
  mounted() {
    this.getTradeList(this.selected);
  },
  watch: {
    selected(v) {
      this.getTradeList(v);
    },
  },
};
</script>
