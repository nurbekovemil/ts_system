<template>
  <v-row>
    <template v-if="user.role == 'ADMIN'">
      <v-col cols="12" md="12">
        <table-rows />
      </v-col>
    </template>
    <template v-if="user.role == 'USER'">
      <v-col cols="12" md="6">
        <processing-offers />
      </v-col>
    </template>
  </v-row>
</template>
<script>
import TableRows from "../../components/admin/Dashboard/TableRows.vue";
import ProcessingOffers from "../../components/admin/Dashboard/ProcessingOffers.vue";
import { mapState } from "vuex";
export default {
  components: {
    TableRows,
    ProcessingOffers,
  },
  computed: {
    ...mapState("user", ["user"]),
  },
};
</script>
<style>
</style>