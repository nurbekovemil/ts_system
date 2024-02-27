<template>
  <transactions-view :transaction="transaction" />
</template>

<script>
import TransactionsView from "../../components/admin/Transactions/View.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: { TransactionsView },
  computed: {
    ...mapState("transaction", ["transaction"]),
  },
  methods: {
    ...mapActions("transaction", ["GET_TRANSACTION_BY_ID"]),
  },
  mounted() {
    this.GET_TRANSACTION_BY_ID(this.$route.params.id);
  },
};
</script>

<style>
</style>