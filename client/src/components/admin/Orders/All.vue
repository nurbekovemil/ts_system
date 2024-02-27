<template lang="">
	<div>
		<v-row>
			<v-col cols="12" md="3">
<v-select
        v-model="type"
        :items="types"
        menu-props="auto"
        item-text="title"
        item-value="type"
        label="Тип заявки"
        dense
        outlined
        hide-details
      ></v-select>
			</v-col>
			<v-col cols="12" md="12">
		<v-simple-table>
			<template v-slot:default>
				<thead>
					<tr class="d-none d-md-table-row">
						<th class="text-left">
							Название
						</th>
            <th class="text-left">
							Тип заявки
						</th>

							<th  v-if="user.role == 'ADMIN'">
							Пользователь
							</th>
						<th class="text-left">
							Статус
						</th>
						<th class="text-left">
							Дата
						</th>
						<th class="text-left" width="30%">
							Цена
						</th>
						<th class="text-left">
							Количество
						</th>
						<th class="text-left" width="20%">
							Стоимость
						</th>
						<th>

						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="d-flex flex-wrap d-md-table-row my-2 py-3" style="width:100%;border: 1px solid #E1E5E8; border-radius:10px;" v-for="(order, i) of order_list.rows" :key="i">
						<td style="flex: 0 1 100%;">
							<v-btn
								rounded
								plain
								small
								color="primary"
								@click="viewOrder(order.id)"
                class="text-xs-caption"
							>
								{{ order.title }}
							</v-btn>
						</td>
            <td :style="breakpoint == 'xs' && 'font-size: 10px;'">
              {{order.order_type}}
            </td>
								<td v-if="user.role == 'ADMIN'">
									<v-btn
										rounded
										plain
										small
										color="primary"
										router
										:to="`/dashboard/user/${order.user_id}`"
									>
										{{ order.username }}
									</v-btn>
								</td>

						<td>
							<v-chip small :color="order.status_color" text-color="white">
									{{ order.status }}
							</v-chip>
						</td>
						<td>{{ order.created_at }}</td>
						<td>{{ validPrice(order.price) }} {{order.symbol}}</td>
						<td >{{ order.amount }} / {{order.weight_title}}</td>
						<td :style="breakpoint == 'xs' && 'font-size: 11px;'">{{ validPrice(order.cost) }} {{order.symbol}}</td>
						<td v-if="user.role === 'ADMIN'">
							<v-menu offset-y transition="slide-x-transition" bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list nav dense>
                    <template v-if="order.status_code == 2">
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
                    <template v-if="order.status_code == 7">
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
										<template>
											<v-hover v-slot="{ hover }" >
												<v-list-item
													:disabled="order.status_code == 3"
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
										</template>
                  </v-list>
                </v-menu>
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
			</v-col>
			<v-col cols="12" md="12">
<v-pagination
				v-if="order_list.count > limit"
        v-model="page"
        :length="order_count"
        color="#78C3CC"
        app
      ></v-pagination>
			</v-col>
		</v-row>
		
	</div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["status"],
  data: () => ({
    type: 1,
    types: [
      { title: "Заявка на продажу", type: 1 },
      { title: "Заявка на покупку", type: 2 },
    ],
    page: 1,
    limit: 10,
  }),
  mounted() {
    this.getAllOrderList();
  },
  computed: {
    ...mapState("order", ["order_list"]),
    ...mapState("user", ["user", "isAuth"]),
    order_count() {
      return Math.ceil(this.order_list.count / this.limit);
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
  },
  methods: {
    ...mapActions("order", [
      "ALL_ORDER_LIST",
      "DELETE_ORDER",
      "UPDATE_ORDER_STATUS",
    ]),
    validPrice(number) {
      return new Intl.NumberFormat("ru", { style: "decimal" }).format(number);
    },
    getAllOrderList() {
      this.ALL_ORDER_LIST({
        page: this.page,
        limit: this.limit,
        type: this.type,
      });
    },
    viewOrder(id) {
      this.$router.push({ path: `/dashboard/order/${id}` });
    },
    async updateMyOrderStatus(order_id, status) {
      await this.UPDATE_ORDER_STATUS({ order_id, status, isAuth: this.isAuth });
      await this.getAllOrderList();
    },
    async deleteOrder(id) {
      await this.DELETE_ORDER({ id });
      await this.getAllOrderList();
    },
  },
  watch: {
    page(v) {
      this.ALL_ORDER_LIST({ page: v, limit: this.limit });
    },
    type() {
      this.getAllOrderList();
    },
  },
};
</script>
<style scoped>
@media only screen and (max-width: 960px) {
  td {
    border: none !important;
  }
}
</style>
