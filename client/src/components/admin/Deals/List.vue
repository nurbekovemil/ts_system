<template>
  <v-card>
    <template v-if="deals.length > 0">
      <v-simple-table>
        <thead>
          <tr>
            <th width="5%">ID</th>
            <th width="5%" class="text-center"><v-icon>mdi-account</v-icon></th>
            <th>Предложение</th>
            <th>На заявку</th>
            <th width="10%">Статус</th>
            <th width="6%">Дата</th>
            <th width="8%"></th>
            <th width="8%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(offer, i) in deals" :key="i">
            <td>{{ offer.id }}</td>
            <td>
              <v-chip
                small
                :color="offer.own ? 'green' : 'orange'"
                text-color="white"
              >
                {{ offer.own ? "Вы" : "Вам" }}
              </v-chip>
            </td>
            <td>
              <template v-if="user.role === 'ADMIN'">
                {{ offer.from_username }}
              </template>
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
              <template v-if="user.role === 'ADMIN'">
                {{ offer.to_username }}
              </template>
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
            <td>
              <v-menu offset-y transition="slide-x-transition" bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list nav dense>
                  <v-hover v-slot="{ hover }">
                    <v-list-item
                      :disabled="offer.status == 2 || !offer.own"
                      link
                      dense
                      @click="deleteOffer(offer.id)"
                    >
                      <v-list-item-icon>
                        <v-icon :color="`${hover && 'red lighten-1'}`"
                          >mdi-delete</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-title> Удалить </v-list-item-title>
                    </v-list-item>
                  </v-hover>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </template>
    <template v-else>
      <p class="font-weight-light text--disabled text-center">
        {{
          this.status == 2 ? "Вы еще не совершали сделок." : "Предложений нет."
        }}
      </p>
    </template>
  </v-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["status"],
  computed: {
    ...mapState("deal", ["deals"]),
    ...mapState("user", ["user"]),
  },
  methods: {
    ...mapActions("deal", ["GET_DEAL_LIST", "DELETE_OFFER_BY_ID"]),
    viewOrder(id) {
      this.$router.push("/dashboard/order/" + id);
    },
    viewOffer(id) {
      this.$router.push("/dashboard/offer/" + id);
    },
    viewDeal(id) {
      this.$router.push("/dashboard/deal/" + id);
    },
    deleteOffer(id) {
      this.DELETE_OFFER_BY_ID(id);
    },
  },
  mounted() {
    this.GET_DEAL_LIST(this.status);
  },
};
</script>
