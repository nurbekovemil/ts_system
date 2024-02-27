<template>
  <div>
    <template>
      <v-row class="my-2 mx-1" align="center">
        <h4 class="mb-3 mt-5 text-body-2">
          {{ this.type == 1 ? "Заявки на продажу" : "Заявки на покупку" }}
        </h4>
        <v-spacer />
        <v-btn
          v-if="type == 1"
          text
          elevation="0"
          @click="openIsAddDialog"
          small
          color="grey"
        >
          <v-icon> mdi-plus </v-icon>
          Создать заявку
        </v-btn>
      </v-row>
    </template>
    <template v-if="getOrderByType(type).length > 0">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th width="5%">ID</th>
              <th class="text-left" width="40%">Название</th>
              <th class="text-left">Статус</th>
              <th class="text-left">Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, i) in getOrderByType(type)" :key="i">
              <td>{{ order.id }}</td>
              <td>
                <v-btn
                  rounded
                  plain
                  small
                  color="primary"
                  router
                  :to="`/dashboard/order/${order.id}`"
                >
                  {{ order.title }}
                </v-btn>
              </td>
              <td>
                <template>
                  <v-chip small :color="order.status_color" text-color="white">
                    {{ order.status }}
                  </v-chip>
                </template>
              </td>
              <td>{{ order.created_at }}</td>
              <td class="text-right">
                <v-menu offset-y transition="slide-x-transition" bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list nav dense>
                    <template v-if="order.status_id == 2">
                      <v-hover v-slot="{ hover }">
                        <v-list-item
                          link
                          dense
                          @click="updateMyOrderStatus(order.id, 7)"
                        >
                          <v-list-item-icon>
                            <v-icon :color="`${hover && 'cyan'}`"
                              >mdi-clock-outline</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-title> Приостановить </v-list-item-title>
                        </v-list-item>
                      </v-hover>
                    </template>
                    <template v-if="order.status_id == 7">
                      <v-hover v-slot="{ hover }">
                        <v-list-item
                          link
                          dense
                          @click="updateMyOrderStatus(order.id, 2)"
                        >
                          <v-list-item-icon>
                            <v-icon :color="`${hover && 'cyan'}`"
                              >mdi-access-point</v-icon
                            >
                          </v-list-item-icon>
                          <v-list-item-title> Открыть </v-list-item-title>
                        </v-list-item>
                      </v-hover>
                    </template>
                    <v-hover v-slot="{ hover }">
                      <v-list-item
                        link
                        dense
                        @click="openIsEditDialog(order.id)"
                      >
                        <v-list-item-icon>
                          <v-icon :color="`${hover && 'cyan'}`"
                            >mdi-pencil</v-icon
                          >
                        </v-list-item-icon>
                        <v-list-item-title> Редактировать </v-list-item-title>
                      </v-list-item>
                    </v-hover>
                    <v-hover v-slot="{ hover }">
                      <v-list-item link dense @click="copyOrder(order.id)">
                        <v-list-item-icon>
                          <v-icon :color="`${hover && 'amber darken-1'}`"
                            >mdi-content-copy</v-icon
                          >
                        </v-list-item-icon>
                        <v-list-item-title> Дублировать </v-list-item-title>
                      </v-list-item>
                    </v-hover>
                    <v-hover v-slot="{ hover }">
                      <v-list-item
                        :disabled="order.status_id == 3"
                        link
                        dense
                        @click="deleteOrder(order.id)"
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
          </tbody>
        </template>
      </v-simple-table>
      <v-pagination
        v-model="page"
        :length="order_count"
        color="#78C3CC"
        app
      ></v-pagination>
    </template>
    <template v-else>
      <p class="font-weight-light text--disabled text-center">
        Заявок не добавлено.
      </p>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
export default {
  props: ["type"],
  data: () => ({
    page: 1,
    limit: 10,
  }),
  computed: {
    ...mapState("user", ["isAuth"]),
    ...mapGetters("order", ["getOrderByType", "getOrderCountByType"]),
    order_count() {
      return Math.ceil(this.getOrderCountByType(this.type) / this.limit);
    },
  },
  mounted() {
    this.getMyOrderList(this.page);
  },
  methods: {
    ...mapMutations("order", ["SET_IS_ADD_DIALOG", "SET_IS_EDIT_DIALOG"]),
    ...mapActions("order", [
      "MY_ORDER_LIST",
      "GET_ORDER_BY_ID",
      "DELETE_ORDER",
      "COPY_ORDER",
      "UPDATE_ORDER_STATUS",
    ]),
    deleteOrder(id) {
      this.DELETE_ORDER({ id, type: this.type });
    },
    openIsAddDialog() {
      this.SET_IS_ADD_DIALOG();
    },
    copyOrder(id) {
      console.log(id);
      this.COPY_ORDER({
        type: this.type,
        page: this.page,
        limit: this.limit,
        id,
      });
    },
    openIsEditDialog(id) {
      this.SET_IS_EDIT_DIALOG();
      this.GET_ORDER_BY_ID({ id, isAuth: this.isAuth });
    },
    async updateMyOrderStatus(order_id, status) {
      await this.UPDATE_ORDER_STATUS({ order_id, status, isAuth: this.isAuth });
      await this.getMyOrderList(this.page);
    },
    getMyOrderList(page) {
      this.MY_ORDER_LIST({ type: this.type, page, limit: this.limit });
    },
  },
  watch: {
    page(v) {
      this.getMyOrderList(v);
    },
  },
};
</script>

<style></style>
