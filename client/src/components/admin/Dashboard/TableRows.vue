<template>
  <v-row>
    <v-col cols="12" md="3" v-for="(table, i) in table_rows" :key="i">
      <v-card class="pa-3 d-flex justify-space-between">
        <v-sheet
          color="#78C3CC"
          class="d-flex justify-center align-center"
          elevation="5"
          height="90"
          width="90"
          rounded
        >
          <v-icon size="40" dark> {{ table.icon }} </v-icon>
        </v-sheet>
        <div class="text-right">
          <div class="body-2 grey--text">{{ table.title }}</div>
          <h3 class="display-1 font-weight-light text--primary">
            {{ table.count }}
          </h3>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({}),
  computed: {
    ...mapState("dashboard", ["table_rows"]),
    ...mapGetters("dashboard", ["getRows"]),
  },
  methods: {
    ...mapActions("dashboard", ["GET_TABLE_ROWS"]),
  },
  mounted() {
    for (let t in this.table_rows) {
      this.GET_TABLE_ROWS(t);
    }
  },
};
</script>

<style>
</style>