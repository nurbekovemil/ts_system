<template>
  <v-card elevation="1">
    <v-row class="mt-2">
      <v-col cols="12" md="12" class="d-flex align-center">
        <v-spacer />
        <v-btn
          elevation="0"
          color="#78C3CC"
          class="mr-2"
          dark
          small
          @click="addTenderDialog"
        >
          <v-icon left>mdi-plus</v-icon>
          Добавить</v-btn
        >
      </v-col>
    </v-row>
    <v-card-text>
      <div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" width="6%">ID</th>
                <th class="text-left" width="30%">Название</th>
                <th class="text-left" width="10%">Статус</th>
                <th class="text-left" width="10%">Тип</th>
                <th class="text-left">Категория</th>
                <th class="text-left" width="15%">Город / область</th>
                <th class="text-left" width="10%">Крайний срок</th>
                <th class="text-left" width="5%"></th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tenders.length > 0">
                <tr v-for="tender in tenders" :key="tender.id">
                  <td>{{ tender.id }}</td>
                  <td>
                    <v-btn
                      rounded
                      plain
                      small
                      color="primary"
                      router
                      class="pl-0"
                      :to="`/dashboard/tenders/${tender.id}`"
                    >
                      {{ tender.title }}
                    </v-btn>
                  </td>
                  <td>{{ tender.status_title }}</td>
                  <td>{{ tender.type_title }}</td>
                  <td>{{ tender.category_title }}</td>
                  <td>{{ tender.city_title }}</td>
                  <td>{{ tender.deadline }}</td>
                  <td>
                    <v-menu
                      offset-y
                      transition="slide-x-transition"
                      bottom
                      left
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list nav dense>
                        <v-hover v-slot="{ hover }">
                          <v-list-item
                            link
                            dense
                            @click="deleteTender(tender.id)"
                          >
                            <v-list-item-icon>
                              <v-icon :color="`${hover && 'red lighten-1'}`"
                                >mdi-delete</v-icon
                              >
                            </v-list-item-icon>
                            <v-list-item-title> Удалить </v-list-item-title>
                          </v-list-item>
                        </v-hover>
                      </v-list>
                    </v-menu>
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
    <add />
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Add from "../../components/admin/Tenders/Add.vue";
export default {
  components: { Add },
  data: () => ({}),
  computed: {
    ...mapState("tender", ["isAddTender", "tenders"]),
  },
  methods: {
    ...mapMutations("tender", ["SET_IS_ADD_TENDER"]),
    ...mapActions("tender", ["GET_TENDER_LIST", "DELETE_TENDER"]),
    addTenderDialog() {
      this.SET_IS_ADD_TENDER();
    },
    deleteTender(id) {
      this.DELETE_TENDER(id);
    },
  },
  mounted() {
    this.GET_TENDER_LIST();
  },
};
</script>

<style>
</style>