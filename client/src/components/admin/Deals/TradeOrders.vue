    <template>
  <v-row class="mb-3">
    <v-col>
      <v-card>
        <v-card-actions>
          Заявка {{ sortOrderUser(deal.order_type_from) }}

          <!-- <v-btn
            text
            small
            class="blue--text"
            router
            :to="'/order/' + deal.order_from"
            >{{ sortOrderUser(deal.order_type_from) }}</v-btn
          > -->
          <v-spacer></v-spacer>
          <v-btn
            text
            small
            class="blue--text"
            router
            :to="'/order/' + deal.order_from"
            >Подробнее</v-btn
          >
          <v-btn
            icon
            @click="getTradeOrderById(deal.order_from, 'trade_order_from')"
          >
            <v-icon>{{
              order_1 ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="order_1">
            <v-divider></v-divider>

            <v-card-text>
              <v-simple-table>
                <tbody>
                  <tr class="text-caption">
                    <td class="grey--text">Цена</td>
                    <td>
                      {{ trade_order_from.price }}
                      {{ trade_order_from.currency_symbol }}
                    </td>
                  </tr>
                  <tr class="text-caption">
                    <td class="grey--text">Количество</td>
                    <td>
                      {{ trade_order_from.amount }} /
                      {{ trade_order_from.weight }}
                    </td>
                  </tr>
                  <tr class="text-caption">
                    <td class="grey--text">Стоимость</td>
                    <td>
                      {{ trade_order_from.cost }}
                      {{ trade_order_from.currency_symbol }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
    <v-col>
      <v-card>
        <v-card-actions
          >Заявка {{ sortOrderUser(deal.order_type_to) }}
          <!-- <v-btn
            text
            small
            class="blue--text"
            router
            :to="'/order/' + deal.order_to"
            >{{ sortOrderUser(deal.order_type_to) }}</v-btn
          > -->
          <v-spacer></v-spacer>
          <v-btn
            text
            small
            class="blue--text"
            router
            :to="'/order/' + deal.order_to"
            >Подробнее</v-btn
          >
          <v-btn
            icon
            @click="getTradeOrderById(deal.order_to, 'trade_order_to')"
          >
            <v-icon>{{
              order_2 ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="order_2">
            <v-divider></v-divider>
            <v-card-text>
              <v-simple-table>
                <tbody>
                  <tr class="text-caption">
                    <td class="grey--text">Цена</td>
                    <td>
                      {{ trade_order_to.price }}
                      {{ trade_order_to.currency_symbol }}
                    </td>
                  </tr>
                  <tr class="text-caption">
                    <td class="grey--text">Количество</td>
                    <td>
                      {{ trade_order_to.amount }} /
                      {{ trade_order_to.weight }}
                    </td>
                  </tr>
                  <tr class="text-caption">
                    <td class="grey--text">Стоимость</td>
                    <td>
                      {{ trade_order_to.cost }}
                      {{ trade_order_to.currency_symbol }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: ["deal"],
  data: () => ({
    order_1: false,
    order_2: false,
  }),
  computed: {
    ...mapState("deal", ["trade_order_from", "trade_order_to"]),
  },
  methods: {
    ...mapActions("deal", ["GET_TRADE_ORDER_BY_ID"]),
    sortOrderUser: (type) => (type == 1 ? "продавца" : "покупателя"),
    getTradeOrderById(id, type) {
      type == "trade_order_from"
        ? (this.order_1 = !this.order_1)
        : (this.order_2 = !this.order_2);
      this.GET_TRADE_ORDER_BY_ID({ id, type });
    },
  },
};
</script>

<style>
</style>