<template>
  <v-card elevation="1">
    <v-card-text>
      <div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" width="6%">ID</th>
                <th class="text-left" width="20%">Номер договора</th>
                <th class="text-left" width="30%">Дата</th>
                <th class="text-left" width="40%">Название</th>
                <th class="text-left">Документы</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="passports.length > 0">
                <tr v-for="passport in passports" :key="passport.id">
                  <td>{{ passport.id }}</td>
                  <td>{{ passport.deal_number }}</td>
                  <td>{{ passport.created_at }}</td>

                  <td>
                    <v-btn
                      rounded
                      plain
                      small
                      color="primary"
                      router
                      class="pl-0"
                      :to="`/dashboard/passport/${passport.id}`"
                    >
                      {{ passport.title }} ({{ passport.order_title }})
                    </v-btn>
                  </td>
                  <td>{{ passport.documents }}</td>
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
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data: () => ({}),
  computed: {
    ...mapState("passport", ["passports"]),
    ...mapState("user", ["user", "isAuth"]),
  },
  methods: {
    ...mapActions("passport", ["GET_MY_PASSPORT_LIST"]),
  },
  mounted() {
    this.GET_MY_PASSPORT_LIST(this.user.role);
  },
};
</script>

<style>
</style>