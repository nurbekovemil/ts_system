<template>
  <v-card>
    <template v-if="passport_reg_pays && passport_reg_pays.length">
      <v-card-title>
        {{ passport_reg_pays[0].title }}
      </v-card-title>
      <v-card-subtitle>
        <!-- {{ passport_reg_pays[0].info[0].items[0].value }} -->
      </v-card-subtitle>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" width="6%">№</th>
                <th class="text-left" width="15%">Дата</th>
                <th class="text-left" width="40%">Названия оснований</th>
                <th class="text-left" width="25%">Отправитель</th>
                <th class="text-left" width="25%">Получатель</th>
                <th class="text-left" width="4%"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(reg, i) in passport_reg_pays[0].reg_pays"
                :key="reg.id"
              >
                <td>{{ i + 1 }}</td>
                <td>{{ reg.created_at }}</td>
                <td>{{ reg.title }}</td>
                <td>{{ reg.user_from_name }}</td>
                <td>{{ reg.user_to_name }}</td>
                <td>
                  <v-btn icon @click="deleteRegPay(reg.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
    <template v-else>
      <v-card-subtitle> Не найдено! </v-card-subtitle>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState("passport", ["passport_reg_pays"]),
  },
  methods: {
    ...mapActions("passport", [
      "GET_PASSPORT_REG_PAYS",
      "DELETE_REG_PAY_BY_ID",
    ]),
    deleteRegPay(id) {
      this.DELETE_REG_PAY_BY_ID(id);
    },
  },
  mounted() {
    this.GET_PASSPORT_REG_PAYS(this.$route.params.id);
  },
};
</script>

<style>
</style>