<template>
  <div>
    <order :order="order_view" />
  </div>
</template>

<script>
import Order from "@/components/admin/Orders/Order.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Order,
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