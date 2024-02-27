<template>
  <div>
    <tender-view :tender="tender_view" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import TenderView from "../../components/admin/Tenders/View.vue";
export default {
  components: { TenderView },
  computed: {
    ...mapState("tender", ["tender_view"]),
  },
  methods: {
    ...mapActions("tender", ["GET_TENDER_BY_ID"]),
  },
  mounted() {
    this.GET_TENDER_BY_ID(this.$route.params.id);
  },
};
</script>

<style>
</style>