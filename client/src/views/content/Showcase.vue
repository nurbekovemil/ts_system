<template>
  <list />
</template>

<script>
import List from "../../components/content/Showcase/List.vue";
import { mapActions } from "vuex";
export default {
  components: { List },
  methods: {
    ...mapActions("showcases", ["GET_PROD_LIST"]),
  },
  mounted() {
    this.GET_PROD_LIST();
  },
};
</script>

<style>
</style>