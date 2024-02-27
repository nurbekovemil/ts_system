<template>
  <v-row>
    <!-- <v-col v-for="order in deal_orders" :key="order.id" cols="12">
      <order :order="order" />
    </v-col> -->
    <v-col cols="12">
      <order :order="offerOrder[0]" />
    </v-col>
    <v-col>
      <tools :deal="deal_view" />
    </v-col>
  </v-row>
</template>
<script>
import { mapActions, mapState } from "vuex";
import Tools from "../../components/admin/Deals/Tools.vue";
import Order from "../../components/admin/Orders/Order.vue";

export default {
  components: {
    Order,
    Tools,
  },
  computed: {
    ...mapState("deal", ["deal_orders", "deal_view"]),
    offerOrder() {
      return this.deal_orders.filter((o) => !o.own);
    },
  },
  methods: {
    ...mapActions("deal", ["GET_DEAL_ORDERS"]),
  },
  mounted() {
    this.GET_DEAL_ORDERS(this.$route.params.id);
  },
};
</script>

<style></style>
