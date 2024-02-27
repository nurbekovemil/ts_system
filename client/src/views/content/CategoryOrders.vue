<template>
  <v-container>
    <orders :title="title" />
    <latest-orders />
  </v-container>
</template>

<script>
import LatestOrders from "../../components/content/Сatalog/LatestOrders.vue";
import Orders from "../../components/content/Сatalog/Orders.vue";
export default {
  props: ["title"],
  components: {
    Orders,
    LatestOrders,
  },
};
</script>

<style>
</style>