<template lang="">
	<v-card class="mt-5">
	<v-row>
		<v-col :cols="isViewUser ? '8' : '12'">
				<v-simple-table>
					<template>
						<thead>
							<tr>
								<th width="5%">ID</th>
								<th width="5%"></th>
								<th class="text-left">
									Пользователь
								</th>
								<th class="text-left">Статус</th>
								<th class="text-left">
									Роль
								</th>
								<th class="text-left">
									Последний визит 
								</th>
								<th>
									Количество заявок
								</th>
								<th class="text-right">
									<v-btn text
          elevation="0" small
          color="grey" @click="toggleAddUserDialog">
										<v-icon left>mdi-account-plus</v-icon>
										Добавить
									</v-btn>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="user in usersList.users"
								:key="user.id"
								:class="isViewUser && isViewUser.id == user.id && 'grey lighten-3'"
							>
								<td>{{user.id}}</td>
								<td>
									<v-avatar size="36">
										<img src="@/assets/john.jpg" />
									</v-avatar>
								</td>

								<td>
									<v-btn
										rounded
										plain
										small
										:color="user.own ? 'success' : 'primary'"
										
										router
										:to="`/dashboard/user/${user.id}`"
									>
										{{ user.username ? user.username : '[новый]' }}
									</v-btn>
								</td>
								<td>
									<v-chip small :color="user.status_color" text-color="white">
                    {{ user.status_title }}
                  </v-chip>
								</td>
								<td>{{ user.role_title }}</td>
								<td>{{user.last_visit}}</td>
								<!-- <td>{{user.last_visit && moment([user.last_visit])}} --- {{user.last_visit}}</td> -->

								<td>{{ user.orders }}</td>
								<td class="text-right">
									<v-menu bottom left>
										<template v-slot:activator="{ on, attrs }">
											<v-btn icon v-bind="attrs" v-on="on">
												<v-icon>mdi-dots-vertical</v-icon>
											</v-btn>
										</template>

										<v-list>
											<v-list-item
												link
												dense
												@click="toggleEditUserDialog(user.id)"
											>
												<v-list-item-icon>
													<v-icon>mdi-pencil</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													Редактировать
												</v-list-item-title>
											</v-list-item>

											<v-list-item link dense :disabled="user.own || user.orders != 0" @click="deleteUser(user.id)">
												<v-list-item-icon>
													<v-icon>mdi-delete</v-icon>
												</v-list-item-icon>
												<v-list-item-title>
													Удалить
												</v-list-item-title>
											</v-list-item>
										</v-list>
									</v-menu>
								</td>
							</tr>
						</tbody>
					</template>
					<AddUser
						:isAddDialog="isAddDialog"
						@toggleAddUserDialog="toggleAddUserDialog"
					/>
					<EditUser/>
				</v-simple-table>
		</v-col>
		<v-col>
			<div class="text-center">
    <v-pagination
      v-model="page"
      :length="user_count"
			color="#78C3CC"

    ></v-pagination>

  </div>
		</v-col>
	</v-row>
</v-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import AddUser from "@/components/admin/Users/Add.vue";
import EditUser from "@/components/admin/Users/Edit.vue";
import moment from "moment";

export default {
  data: () => ({
    isViewUser: null,
    updateUser: null,
    page: 1,
    limit: 10,
  }),
  components: {
    AddUser,
    EditUser,
  },
  computed: {
    ...mapState("user", ["usersList", "isAddDialog", "isEditDialog"]),
    user_count() {
      return Math.ceil(this.usersList.user_count / this.limit);
    },
  },

  mounted() {
    this.USERLIST({ limit: this.limit, page: this.page });
  },
  // filters: {
  //   moment: function () {
  //     moment.locale("ru");
  //     return moment();
  //   },
  // },
  methods: {
    ...mapActions("user", ["USERLIST", "DELETEUSER", "GET_USER_BY_ID"]),
    ...mapMutations("user", ["TOGGLE_ADD_DIALOG", "TOGGLE_EDIT_DIALOG"]),
    toggleAddUserDialog() {
      this.TOGGLE_ADD_DIALOG();
    },
    moment() {
      moment.locale("ru");
      return moment();
    },
    toggleEditUserDialog(id) {
      this.GET_USER_BY_ID(id);
      this.TOGGLE_EDIT_DIALOG();
    },
    viewUser(user) {
      if (user) {
        return (this.isViewUser = user);
      }
      this.isViewUser = null;
    },
    deleteUser(id) {
      this.DELETEUSER(id);
    },
  },
  watch: {
    page(v) {
      this.USERLIST({ limit: this.limit, page: v });
    },
  },
};
</script>

<style lang=""></style>
