<template>
  <showcase-view />
</template>

<script>
import ShowcaseView from "../../components/admin/Showcase/View.vue";
import { mapActions } from "vuex";

export default {
  components: { ShowcaseView },
  methods: {
    ...mapActions("showcases", ["GET_PROD_BY_ID"]),
  },
  mounted() {
    this.GET_PROD_BY_ID(this.$route.params.id);
  },
};
</script>

<style>
</style>