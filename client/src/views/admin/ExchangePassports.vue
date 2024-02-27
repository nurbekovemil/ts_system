<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>Паспорты</v-tab>
      <v-tab v-if="user.role == 'ADMIN'">Регистрация платежей</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <list />
      </v-tab-item>
      <v-tab-item v-if="user.role == 'ADMIN'">
        <reg-reports />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import List from "../../components/admin/Passport/List.vue";
import { mapState } from "vuex";
import RegReports from "../../components/admin/Passport/RegReports.vue";
export default {
  data: () => ({
    tab: 0,
  }),
  computed: {
    ...mapState("user", ["user"]),
  },
  components: { List, RegReports },
};
</script>

<style>
</style>