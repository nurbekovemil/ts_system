<template>
  <div class="ma-3" v-if="latest_orders.length > 0">
    <v-sheet elevation="0">
      <div class="ma-2">Недвно посмотрели</div>
      <v-slide-group>
        <v-slide-item v-for="order in latest_orders" :key="order.id">
          <v-card
            @click="viewOrder(order.id)"
            width="250"
            class="rounded-lg ma-2"
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
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    url_api: process.env.VUE_APP_BACK_API,
  }),
  computed: {
    ...mapState("catalog", ["latest_orders"]),
  },
  methods: {
    ...mapActions("catalog", ["GET_LATESTORDERS"]),
    latestOrders() {
      let latestorders =
        JSON.parse(localStorage.getItem("latest_orders")) || [];
      if (latestorders.length > 0) {
        this.GET_LATESTORDERS({ order_ids: latestorders });
      }
    },
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
    this.latestOrders();
  },
};
</script>

<style>
</style>