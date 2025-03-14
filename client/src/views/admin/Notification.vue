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
            @click="openAddDialog"
          >
            <v-icon left>mdi-plus</v-icon>
            Написать</v-btn
          >
        </v-col>
      </v-row>
  
      <v-card-text>
        <div>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Документ</th>
                  <th class="text-left">Отправитель</th>
                  <th class="text-left">Получатль</th>
                  <th class="text-left">Дата</th>
                  <th class="text-left" width="5%"></th>
                </tr>
              </thead>
              <tbody>
                <template v-if="notifications.length > 0">
                  <tr v-for="(item, i) in notifications" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td @click="notificationView(item.id)"><a class="text-decoration-none">{{ item.title }}</a> 
                    <v-chip
                      v-if="!item.is_read_status"
                      color="#c8eac9"
                      :style="'color: green'"
                      class="ml-2"
                      small
                      >
                        новый
                      </v-chip>
                    </td>
                    <td>{{ item.user_from_company }}</td>
                    <td>{{ item.user_to_company }}</td>
                    <td>{{ item.created_at }}</td>
                    <td>
                      <v-menu
                        offset-y
                        transition="slide-x-transition"
                        bottom
                        left
                        v-if="item.user_from == user.username"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
  
                        <v-list nav dense>
                          <v-hover v-slot="{ hover }">
                            <v-list-item link dense @click="openEditDialog(item.id)">
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
                            <v-list-item link dense @click="openDeleteDialog(item.id)">
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
      <v-dialog v-model="isDeleteDialog" max-width="30%">
        <v-card>
          <v-card-title> Вы уверены что хотите удалить? </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="orange darken-1" text @click="closeDeleteDialog">
              Закрыть
            </v-btn>
            <v-btn color="red darken-1" text @click="deleteNotification"> Удалить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <add />
      <Detail />
      <Edit />
    </v-card>
  </template>
  <script>
  import { mapState, mapMutations, mapActions } from "vuex";
  import Add from "../../components/admin/Notification/Add.vue";
  import Detail from "../../components/admin/Notification/View.vue";
  import Edit from "../../components/admin/Notification/Edit.vue";
  export default {
    components: { Add, Detail, Edit },
    data: () => ({
      isDeleteDialog: false,
      deleteId: null,
    }),
    computed: {
      ...mapState("user", ["user"]),
      ...mapState("notification", ["notifications", "isAddDialog","isViewDialog"]),
    },
    methods: {
      ...mapMutations("notification", ["SET_IS_ADD_DIALOG","SET_IS_EDIT_DIALOG","SET_IS_VIEW_DIALOG"]),
      ...mapActions("notification", ["GET_NOTIFICATIONS","GET_NOTIFICATION_BY_ID","GET_COUNT_UNREAD_NOTIFICATIONS","DELETE_NOTIFICATION"]),
      openAddDialog() {
        this.SET_IS_ADD_DIALOG();
      },
      openEditDialog(id) {
        this.GET_NOTIFICATION_BY_ID(id);
        this.SET_IS_EDIT_DIALOG();
      },
      openDeleteDialog(id) {
        this.deleteId = id;
        this.isDeleteDialog = true;  
      },
      closeDeleteDialog() {
        this.deleteId = null;
        this.isDeleteDialog = false;
      },
      notificationView(id) {
        this.GET_NOTIFICATION_BY_ID(id);
        this.SET_IS_VIEW_DIALOG();
      },
      deleteNotification() {
        this.DELETE_NOTIFICATION(this.deleteId);
        this.closeDeleteDialog();
      },
    },
    mounted() {
      this.GET_NOTIFICATIONS();
      this.GET_COUNT_UNREAD_NOTIFICATIONS();
    },
  };
  </script>
  
  
  <style>
  </style>