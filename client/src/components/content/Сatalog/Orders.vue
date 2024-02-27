<template>
  <v-container class="fill-height">
    <template v-if="category_orders.length > 0">
      <v-row>
        <div class="body-1">{{ title }}</div>
      </v-row>
      <v-row>
        <v-col class="my-5">
          <v-row>
            <v-col
              class="my-3"
              cols="6"
              sm="4"
              md="3"
              v-for="order in category_orders"
              :key="order.id"
            >
              <v-card
                @click="viewOrder(order.id)"
                width="300"
                class="rounded-lg"
              >
                <v-card-subtitle> {{ order.title }} </v-card-subtitle>

                <v-img
                  :src="
                    order.images[0] != null
                      ? `${url_api}/${order.images[0].path}`
                      : `${url_api}/static/images/default.png`
                  "
                  height="280px"
                >
                </v-img>
                <v-card-actions>
                  <div class="ml-2">
                    {{ order.price }} {{ order.currency_symbol }}
                  </div>
                  <v-spacer></v-spacer>

                  <v-btn color="#78C3CC" small text> Посмотреть </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <div class="body-2">Заявки в данной категории отсутствуют!</div>
    </template>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: ["title"],
  data: () => ({
    url_api: process.env.VUE_APP_BACK_API,
  }),
  computed: {
    ...mapState("catalog", ["category_orders"]),
  },
  methods: {
    ...mapActions("catalog", ["GET_CATEGORY_ORDERS"]),
    viewOrder(id) {
      let latestorders =
        JSON.parse(localStorage.getItem("latest_orders")) || [];
      if (latestorders.length && latestorders.length > 10) {
        latestorders.pop();
      }
      if (latestorders.length) {
        let isViewed = latestorders.filter((el) => el == id);
        if (isViewed.length == 0) {
          latestorders.unshift(id);
        }
      } else {
        latestorders.unshift(id);
      }
      localStorage.setItem("latest_orders", JSON.stringify(latestorders));
      this.$router.push("/order/" + id);
    },
  },
  mounted() {
    this.GET_CATEGORY_ORDERS(this.$route.params.id);
  },
};
</script>

<style scoped>
.view-all {
  color: grey;
  text-decoration: none;
  font-size: 17px;
}
</style>
