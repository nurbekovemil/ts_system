<template>
  <v-card width="100%" elevation="0">
    <v-card-text v-if="offer_history.length > 0">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Заявка</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Стоимость</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="offer in offer_history" :key="offer.id">
              <td>{{ offer.title }}</td>
              <td>{{ offer.price }} {{ offer.currency_symbol }}</td>
              <td>{{ offer.amount }} / {{ offer.order_weight }}</td>
              <td>{{ offer.cost }} {{ offer.currency_symbol }}</td>
              <td>{{ offer.created_at }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-text v-else> Предложений нет! </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["id"],
  computed: {
    ...mapState("deal", ["offer_history"]),
  },
};
</script>

<style>
</style>