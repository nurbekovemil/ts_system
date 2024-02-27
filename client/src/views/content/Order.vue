<template>
  <v-container class="pa-0 fill-height">
    <v-row>
      <order :order="order_view" />
    </v-row>
    <v-row>
      <latest-orders />
    </v-row>
  </v-container>
</template>

<script>
import Order from "@/components/admin/Orders/Order.vue";
import { mapState, mapActions } from "vuex";
import LatestOrders from "../../components/content/Сatalog/LatestOrders.vue";
export default {
  components: {
    Order,
    LatestOrders,
  },
  computed: {
    ...mapState("user", ["isAuth"]),
    ...mapState("order", ["order_view"]),
  },
  methods: {
    ...mapActions("order", ["GET_ORDER_BY_ID"]),
    ...mapActions("deal", ["GET_OFFER_HISTORY"]),
  },
  mounted() {
    this.GET_ORDER_BY_ID({ id: this.$route.params.id, isAuth: this.isAuth });
    this.GET_OFFER_HISTORY(this.$route.params.id);
  },
};
</script>

<style>
</style>