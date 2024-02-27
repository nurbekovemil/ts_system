<template>
  <v-container>
    <trade-orders :deal="deal_view" />
    <!-- <deal :deal="deal_view" :comments="deal_comments" /> -->
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Deal from "../../components/admin/Deals/Deal.vue";
import TradeOrders from "../../components/admin/Deals/TradeOrders.vue";

export default {
  components: {
    Deal,
    TradeOrders,
  },
  computed: {
    ...mapState("deal", ["deal_view", "deal_comments"]),
  },
  methods: {
    ...mapActions("deal", ["GET_TRADE_BY_ID"]),
    sortOrderUser: (type) => (type == 1 ? "Продавца" : "Покупателя"),
  },
  mounted() {
    this.GET_TRADE_BY_ID(this.$route.params.id);
  },
};
</script>

<style>
</style>