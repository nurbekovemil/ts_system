<template>
  <v-card elevation="1">
    <v-card-text>
      <div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" width="6%">№</th>
                <th class="text-left" width="30%">Название</th>
                <th class="text-left" width="15%">Статус</th>
                <th class="text-left" width="10%">Тип</th>
                <th class="text-left">Категория</th>
                <th class="text-left" width="15%">Город / область</th>
                <th class="text-left" width="10%">Крайний срок</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tenders.length > 0">
                <tr v-for="(tender, i) in tenders" :key="tender.id">
                  <td>{{ i + 1 }}</td>

                  <td>
                    <v-btn
                      rounded
                      plain
                      small
                      color="primary"
                      router
                      class="pl-0"
                      :to="
                        isAuth
                          ? `/dashboard/tenders/${tender.id}`
                          : `/tenders/${tender.id}`
                      "
                    >
                      {{ tender.title }}
                    </v-btn>
                  </td>
                  <td>{{ tender.status_title }}</td>
                  <td>{{ tender.type_title }}</td>
                  <td>{{ tender.category_title }}</td>
                  <td>{{ tender.city_title }}</td>
                  <td>{{ tender.deadline }}</td>
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
    ...mapState("tender", ["tenders"]),
    ...mapState("user", ["user", "isAuth"]),
  },
  methods: {
    ...mapActions("tender", ["GET_TENDER_ALL_LIST"]),
  },
  mounted() {
    this.GET_TENDER_ALL_LIST(this.user.role);
  },
};
</script>

<style>
</style>