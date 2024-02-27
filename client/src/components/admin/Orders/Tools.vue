<template>
  <div class="mt-5">
    <!-- private template for admin -->
    <template v-if="user.role == 'ADMIN'">
      <template v-if="order_view.status === 1">
        <v-btn
          text
          small
          color="orange darken-1"
          class="mr-2"
          @click="confirmOrReject(order_view.id, 4)"
        >
          <v-icon left>mdi-close</v-icon>

          Отклонить
        </v-btn>
        <v-btn
          color="#78C3CC"
          dark
          elevation="0"
          small
          @click="confirmOrReject(order_view.id, 2)"
        >
          <v-icon left>mdi-check</v-icon>
          Принять
        </v-btn>
      </template>
    </template>

    <template v-if="user.role === 'USER'">
      <template v-if="order_view.status === 4">
        <v-btn
          color="orange darken-1"
          dark
          elevation="0"
          small
          @click="confirmOrReject(order_view.id, 1)"
        >
          Повторно отправить
        </v-btn>
      </template>
      <!-- here more buttons  -->
    </template>

    <!-- private template -->
    <v-row
      v-if="user.role != 'ADMIN' && !order_view.own && order_view.status == 2"
    >
      <!-- <v-btn text small dark color="blue darken-1"> Позвонить </v-btn> -->
      <template v-if="order_view.auction && order_view.is_auction">
        <v-btn small dark color="#78C3CC" @click="openIsAddOfferDialog">
          Предложить
        </v-btn>
      </template>
      <template v-if="order_view.auction && !order_view.is_auction">
        <v-btn small dark color="#78C3CC" @click="openIsAddOfferDialog">
          Купить
        </v-btn>
      </template>
    </v-row>

    <!-- public template -->
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState("user", ["user", "isAuth"]),
    ...mapState("order", ["order_view"]),
  },
  methods: {
    ...mapMutations("deal", ["SET_IS_ADD_DEAL_DIALOG"]),
    ...mapActions("order", ["UPDATE_ORDER_STATUS"]),
    openIsAddOfferDialog() {
      this.isAuth ? this.SET_IS_ADD_DEAL_DIALOG() : this.$router.push("/login");
    },
    confirmOrReject(order_id, status) {
      this.UPDATE_ORDER_STATUS({ order_id, status, isAuth: this.isAuth });
    },
  },
};
</script>

<style scoped></style>
