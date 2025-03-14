<template>
  <v-card>
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
    <v-col v-if="deals.length > 0" cols="12" md="12">
      <v-simple-table>
        <thead>
          <tr>
            <th width="5%">ID</th>
            <th>Заявка от пользователя</th>
            <th>Пользователю</th>
            <th width="10%">Статус</th>
            <th width="6%">Дата</th>
            <th width="8%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(offer, i) in deals" :key="i">
            <td>{{ offer.id }}</td>

            <td>
              {{ offer.from_username }} -
              <v-btn
                rounded
                plain
                small
                color="primary"
                class="px-0"
                @click="viewOrder(offer.order_from)"
              >
                {{ offer.title_order_from }}
              </v-btn>
            </td>

            <td>
              {{ offer.to_username }} -
              <v-btn
                rounded
                plain
                small
                color="primary"
                class="px-0"
                @click="viewOrder(offer.order_to)"
              >
                {{ offer.title_order_to }}
              </v-btn>
            </td>

            <td>
              <v-chip small :color="offer.status_color" text-color="white">
                {{ offer.status_title }}
              </v-chip>
            </td>
            <td>{{ offer.created_at }}</td>
            <td>
              <v-btn
                rounded
                plain
                small
                color="primary"
                @click="
                  offer.status == 1 || offer.status == 3
                    ? viewOffer(offer.id)
                    : viewDeal(offer.id)
                "
              >
                Посмотреть
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-col>
    <v-col v-else cols="12" md="12">
      <p class="font-weight-light text--disabled text-center">
        Сделок не найдено!
      </p>
    </v-col>
  </v-row>
</v-card>
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
      { title: "За год", date: 366 },
      { title: "Все", date: "all" },
    ],
  }),
  computed: {
    ...mapState("deal", ["deals"]),
  },
  methods: {
    ...mapActions("deal", ["GET_DEPO_DEALS"]),
    viewOrder(id) {
      this.$router.push("/dashboard/order/" + id);
    },
    viewOffer(id) {
      this.$router.push("/dashboard/offer/" + id);
    },
    viewDeal(id) {
      this.$router.push("/dashboard/deal/" + id);
    },
  },
  mounted() {
    this.GET_DEPO_DEALS(this.selected);
  },
  watch: {
    selected(v) {
      this.GET_DEPO_DEALS(v);
    },
  },
};
</script>
