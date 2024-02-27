<template>
  <v-card>
    <v-row class="mt-2 ml-0">
      <v-col cols="12" md="12" class="d-flex align-center justify-end">
        <v-btn
          elevation="0"
          color="#78C3CC"
          class="mr-2"
          dark
          small
          @click="openAddProd"
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
                <th class="text-left" width="5%">ID</th>
                <th class="text-left">Названия</th>
                <th class="text-left" width="15%">Количество</th>
                <th class="text-left" width="15%">Цена</th>
                <th class="text-left" width="5%"></th>
              </tr>
            </thead>
            <tbody>
              <template v-if="products && products.length > 0">
                <tr v-for="prod in products" :key="prod.id">
                  <td>{{ prod.id }}</td>
                  <td @click="prodView(prod.id)">
                    <a class="text-decoration-none">{{ prod.title }}</a>
                  </td>
                  <td>{{ prod.total }} шт</td>
                  <td>{{ prod.price }} сом</td>
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
                            @click="openEditDialog(prod.id)"
                          >
                            <v-list-item-icon>
                              <v-icon :color="`${hover && 'cyan'}`"
                                >mdi-pencil</v-icon
                              >
                            </v-list-item-icon>
                            <v-list-item-title>
                              Редактировать
                            </v-list-item-title>
                          </v-list-item>
                        </v-hover>
                        <v-hover v-slot="{ hover }">
                          <v-list-item link dense @click="deleteProd(prod.id)">
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
    <v-card-actions class="d-flex justify-center">
      <!-- <v-pagination
        v-model="page"
        :length="transfer_count"
        color="#78C3CC"
      ></v-pagination> -->
    </v-card-actions>
    <add />
    <edit />
  </v-card>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Edit from "../../components/admin/Showcase/Edit.vue";
import Add from "../../components/admin/Showcase/Add.vue";
export default {
  components: { Add, Edit },
  data: () => ({}),
  computed: {
    ...mapState("showcases", ["products"]),
  },
  methods: {
    ...mapMutations("showcases", ["SET_IS_ADD_DIALOG", "SET_IS_EDIT_DIALOG"]),
    ...mapActions("showcases", [
      "GET_PROD_LIST",
      "DELETE_PROD",
      "GET_PROD_BY_ID",
    ]),
    openAddProd() {
      console.log("b");
      this.SET_IS_ADD_DIALOG();
    },
    openEditDialog(id) {
      this.GET_PROD_BY_ID(id);
      this.SET_IS_EDIT_DIALOG();
    },
    prodView(id) {
      this.$router.push(`/dashboard/products/${id}`);
    },
    deleteProd(id) {
      this.DELETE_PROD(id);
    },
  },
  mounted() {
    this.GET_PROD_LIST();
  },
};
</script>


<style>
</style>