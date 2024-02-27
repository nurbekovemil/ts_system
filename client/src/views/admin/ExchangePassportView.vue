<template>
  <passport-view :passport="passport_view" />
</template>

<script>
import { mapActions, mapState } from "vuex";
import PassportView from "../../components/admin/Passport/PView.vue";
export default {
  components: { PassportView },
  computed: {
    ...mapState("passport", ["passport_view"]),
  },
  methods: {
    ...mapActions("passport", ["GET_PASSPORT_BY_ID"]),
  },
  mounted() {
    this.GET_PASSPORT_BY_ID(this.$route.params.id);
  },
};
</script>

<style>
</style>