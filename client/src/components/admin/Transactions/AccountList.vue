<template>
  <v-card>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Пользователь</th>
              <th class="text-left">Счет</th>
              <!-- <th class="text-left">История транзакций</th> -->

              <th class="text-left" width="5%"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="user_accounts.length > 0">
              <tr v-for="account in user_accounts" :key="account.user_id">
                <td>{{ account.username }}</td>
                <td>{{ account.count }} {{ account.symbol }}</td>
                <!-- <td>Посмотреть</td> -->
                <td>
                  <v-btn icon @click="openTransactionDialog(account)">
                    <v-icon color="#78C3CC"> mdi-cash-plus </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template v-else>
              <td colspan="10" class="text-center py-2 text--disabled">
                Не найдено!
              </td>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <transaction />
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Transaction from "./Transaction.vue";
export default {
  components: { Transaction },
  computed: {
    ...mapState("transaction", ["user_accounts"]),
  },
  methods: {
    ...mapActions("transaction", ["GET_USER_ACCOUNTS"]),
    ...mapMutations("transaction", ["TOGGLE_IS_TRANSACTION"]),
    openTransactionDialog(user) {
      this.TOGGLE_IS_TRANSACTION(user);
    },
  },
  mounted() {
    this.GET_USER_ACCOUNTS();
  },
};
</script>

<style>
</style>