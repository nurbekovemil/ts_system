<template>
  <v-container>
    <v-row>
      <v-card width="100%" elevation="0">
        <v-img
          height="200px"
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          class="d-flex align-center"
        >
          <v-card-title
            class="white--text d-flex flex-column align-center justify-center"
          >
            <v-avatar size="100">
              <img
                alt="user"
                src="https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg"
              />
            </v-avatar>
            <div class="mt-3">{{ user_view.username }}</div>
            <div class="body-1">{{ user_view.user_type }}</div>
          </v-card-title>
        </v-img>

        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="12"
              v-if="user_view.me || user.role == 'ADMIN' || user.role == 'CD'"
            >
              <v-card class="pa-3 d-flex justify-space-between">
                <v-sheet
                  color="yellow darken-1"
                  class="d-flex justify-center align-center"
                  elevation="5"
                  height="90"
                  width="90"
                  rounded
                >
                  <v-icon size="40" dark> mdi-cash</v-icon>
                </v-sheet>
                <div class="text-right">
                  <div class="body-3 grey--text">Счет</div>
                  <div class="text-md-h2 font-weight-light text--primary">
                    {{ user_view.count }} {{ user_view.symbol }}
                  </div>
                  <v-btn
                    elevation="0"
                    text
                    color="grey"
                    x-small
                    @click="openTransactionDialog"
                  >
                    <v-icon left> mdi-plus </v-icon>
                    Депонировать
                  </v-btn>
                </div>
              </v-card>
            </v-col>
            <v-col
              ><v-card class="pa-3 d-flex justify-space-between">
                <v-sheet
                  color="info"
                  class="d-flex justify-center align-center"
                  elevation="5"
                  height="90"
                  width="90"
                  rounded
                >
                  <v-icon size="40" dark> mdi-file-document-multiple </v-icon>
                </v-sheet>
                <div class="text-right">
                  <div class="body-3 grey--text">Заявки</div>
                  <h3 class="display-2 font-weight-light text--primary">
                    {{ user_view.user_orders }}
                  </h3>
                </div>
              </v-card></v-col
            >
            <v-col>
              <v-card class="pa-3 d-flex justify-space-between">
                <v-sheet
                  color="success"
                  class="d-flex justify-center align-center"
                  elevation="5"
                  height="90"
                  width="90"
                  rounded
                >
                  <v-icon size="40" dark> mdi-handshake </v-icon>
                </v-sheet>
                <div class="text-right">
                  <div class="body-3 grey--text">Сделки</div>
                  <h3 class="display-2 font-weight-light text--primary">
                    {{ user_view.user_deals }}
                  </h3>
                </div>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-3 d-flex justify-space-between">
                <v-sheet
                  color="orange"
                  class="d-flex justify-center align-center"
                  elevation="5"
                  height="90"
                  width="90"
                  rounded
                >
                  <v-icon size="40" dark> mdi-briefcase-variant </v-icon>
                </v-sheet>
                <div class="text-right">
                  <div class="body-3 grey--text">Предложение</div>
                  <h3 class="display-2 font-weight-light text--primary">
                    {{ user_view.user_offers }}
                  </h3>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-expansion-panels
              mandatory
              v-model="panel"
              class="px-3"
              v-if="user_view.info"
            >
              <template v-for="(item, i) in user_view.info">
                <template v-if="user_view.me">
                  <v-expansion-panel :key="i">
                    <v-expansion-panel-header>
                      {{ item.title }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col
                          cols="12"
                          md="4"
                          v-for="field in item.items"
                          :key="field.field"
                        >
                          <div class="d-flex flex-column">
                            <div class="font-weight-medium">
                              {{ field.title }}
                            </div>
                            <div class="font-weight-light">
                              {{ field.value }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </template>
                <template v-else>
                  <v-expansion-panel :key="i" v-if="i != 4">
                    <v-expansion-panel-header>
                      {{ item.title }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col
                          cols="12"
                          md="4"
                          v-for="field in item.items"
                          :key="field.field"
                        >
                          <div class="d-flex flex-column">
                            <div class="font-weight-medium">
                              {{ field.title }}
                            </div>
                            <div class="font-weight-light">
                              {{ field.value }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </template>
              </template>
            </v-expansion-panels>
          </v-row>
          <v-row>
            <v-col>
              <v-card elevation="0">
                <v-card-actions>
                  <v-chip outlined :color="user_view.status_color">{{
                    user_view.status_title
                  }}</v-chip>
                  <v-spacer />
                  <template
                    v-if="
                      (user_view.me && user_view.status == 2) ||
                      (user.role == 'ADMIN' && user_view.status == 2)
                    "
                  >
                    <v-btn
                      small
                      text
                      color="orange"
                      @click="toggleEditUserDialog"
                    >
                      <v-icon left dark> mdi-pencil </v-icon>

                      Редактировать
                    </v-btn>
                  </template>
                  <template v-if="user.role == 'ADMIN'">
                    <template v-if="user_view.status == 1">
                      <v-btn
                        small
                        text
                        color="orange"
                        @click="updateUserStatus(4)"
                        >Отклонить</v-btn
                      >
                      <v-btn small color="success" @click="updateUserStatus(2)"
                        >Принять</v-btn
                      >
                    </template>
                    <template v-if="user_view.status == 4">
                      <v-btn small color="success" @click="updateUserStatus(2)"
                        >Принять</v-btn
                      >
                    </template>
                    <template v-if="user.username != user_view.username">
                      <template v-if="user_view.status == 2">
                        <v-btn
                          small
                          color="red"
                          dark
                          @click="updateUserStatus(3)"
                        >
                          <v-icon left dark> mdi-account-cancel </v-icon>

                          Заблокировать</v-btn
                        >
                      </template>
                      <template v-if="user_view.status == 3">
                        <v-btn
                          small
                          color="blue darken-1"
                          dark
                          @click="updateUserStatus(2)"
                        >
                          <v-icon left dark> mdi-account-check </v-icon>

                          Разблокировать</v-btn
                        >
                      </template>
                    </template>
                  </template>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <confirm />
    <transaction />
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Transaction from "../Transactions/Transaction.vue";

import Confirm from "./Confirm.vue";
export default {
  data: () => ({
    panel: [0],
  }),
  components: {
    Confirm,
    Transaction,
  },
  computed: {
    ...mapState("user", ["user_view", "user", "isUserStatus"]),
  },
  methods: {
    ...mapActions("user", ["UPDATE_USER_STATUS", ""]),
    ...mapMutations("user", [
      "TOGGLE_EDIT_DIALOG",
      "TOGGLE_IS_USER_STATUS_DIALOG",
    ]),
    ...mapMutations("transaction", ["TOGGLE_IS_TRANSACTION"]),
    updateUserStatus(status) {
      if (this.user_view.status == 1 && status == 2) {
        this.TOGGLE_IS_USER_STATUS_DIALOG();
      } else {
        this.UPDATE_USER_STATUS({ status, user_id: this.$route.params.id });
      }
    },
    openTransactionDialog() {
      this.TOGGLE_IS_TRANSACTION({
        user_id: this.user_view.id,
      });
    },
    toggleEditUserDialog() {
      this.TOGGLE_EDIT_DIALOG();
    },
  },
};
</script>
<style>
</style>