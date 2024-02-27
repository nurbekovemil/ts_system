<template>
  <v-container>
    <list />
    <latest-orders />
  </v-container>
</template>

<script>
import LatestOrders from "../../components/content/Сatalog/LatestOrders.vue";
import List from "../../components/content/Сatalog/List.vue";
export default {
  components: {
    List,
    LatestOrders,
  },
};
</script>

<style>
</style>
List