<template>
  <v-card>
    <v-row class="mt-2 ml-0">
      <v-col cols="12" md="2">
        <v-text-field
          label="Период с"
          v-model="date_from"
          type="date"
          outlined
          dense
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="date_to"
          label="По"
          type="date"
          outlined
          dense
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn
          elevation="0"
          color="#78C3CC"
          class="mr-2"
          dark
          @click="getTransactionList"
        >
          <v-icon left>mdi-filter</v-icon>
          Применить</v-btn
        >
      </v-col>
    </v-row>

    <v-card-text>
      <div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr class="d-none d-md-table-row" style="width: 100%">
                <th class="text-left">ID</th>
                <th class="text-left" width="10%">Тип перевода</th>
                <th class="text-left">Дата</th>
                <th class="text-left">Статус</th>
                <th class="text-left">
                  <v-icon> mdi-tray-arrow-up </v-icon>
                </th>
                <th class="text-left">
                  <v-icon> mdi-tray-arrow-down </v-icon>
                </th>
                <th class="text-left">Сумма</th>
                <th class="text-left" width="10%"></th>
              </tr>
            </thead>
            <tbody>
              <template v-if="transaction_list.length > 0">
                <tr
                  v-for="list in transaction_list"
                  :key="list.id"
                  class="d-flex flex-wrap d-md-table-row my-2 py-3"
                >
                  <td><strong class="d-md-none">ID: </strong> {{ list.id }}</td>
                  <td>
                    <strong class="d-md-none">Тип перевода: </strong
                    >{{ list.type_title }}
                  </td>
                  <td>
                    <strong class="d-md-none">Дата: </strong
                    >{{ list.created_at }}
                  </td>
                  <td>
                    <v-chip small :color="list.status_color" text-color="white">
                      {{ list.status_title }}
                    </v-chip>
                  </td>
                  <td>
                    <strong class="d-md-none"
                      ><v-icon> mdi-tray-arrow-up </v-icon> : </strong
                    >{{ list.user_from_name }}
                  </td>
                  <td>
                    <strong class="d-md-none"
                      ><v-icon> mdi-tray-arrow-down </v-icon> : </strong
                    >{{ list.user_to_name }}
                  </td>
                  <td
                    :class="
                      list.type == 1 || list.type == 3
                        ? 'green--text'
                        : 'error--text'
                    "
                  >
                    <strong class="d-md-none">Сумма</strong>
                    {{ list.type == 1 || list.type == 3 ? "+" : "-"
                    }}{{ list.amount }} сом
                  </td>
                  <td>
                    <div
                      v-if="list.status == 1 && user.role == 'CD'"
                      class="d-flex"
                    >
                      <v-spacer />
                      <v-btn
                        color="orange"
                        icon
                        dark
                        @click="statusUpdate(list.id, 3)"
                      >
                        <v-icon dark> mdi-arrow-u-left-top</v-icon>
                      </v-btn>
                      <v-btn
                        color="green"
                        icon
                        dark
                        @click="statusUpdate(list.id, 2)"
                      >
                        <v-icon dark> mdi-check </v-icon>
                      </v-btn>
                    </div>
                    <div
                      v-if="list.status == 2 || list.status == 3"
                      class="d-flex"
                    >
                      <v-spacer />
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            router
                            :to="`/dashboard/transactions/${list.id}`"
                          >
                            <v-icon dark> mdi-receipt-text </v-icon>
                          </v-btn>
                        </template>
                        <span>Квитанция</span>
                      </v-tooltip>
                    </div>
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
      </div>
    </v-card-text>
    <v-card-actions class="d-flex justify-center">
      <v-pagination
        v-model="page"
        :length="transfer_count"
        color="#78C3CC"
      ></v-pagination>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({
    date_from: "",
    date_to: "",
    page: 1,
    limit: 10,
  }),
  computed: {
    ...mapState("user", ["user"]),
    ...mapState("transaction", ["transaction_list", "transaction_count"]),
    transfer_count() {
      return Math.ceil(this.transaction_count / this.limit);
    },
  },
  methods: {
    ...mapActions("transaction", [
      "GET_TRANSACTION_LIST",
      "UPDATE_TRANSACTION_STATUS",
    ]),
    statusUpdate(id, status) {
      this.UPDATE_TRANSACTION_STATUS({ id, status });
    },
    getTransactionList(page) {
      this.GET_TRANSACTION_LIST({
        date_from: this.date_from,
        date_to: this.date_to,
        page: this.page,
        limit: this.limit,
      });
    },
  },
  mounted() {
    this.getTransactionList();
  },
  watch: {
    page() {
      this.getTransactionList();
    },
  },
};
</script>


<style scoped>
@media only screen and (max-width: 960px) {
  td {
    border: none !important;
  }
}
</style>