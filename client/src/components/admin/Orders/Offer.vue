<template>
  <v-row justify="center">
    <v-dialog v-model="isAddDealDialog" persistent max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-center" width="100%">
          {{
            order_view.is_auction
              ? "Стандартный аукцион"
              : "Двойной встречный аукцион"
          }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="12" class="text-center">
                <span class="text-h5">
                  {{ order_view.title }}
                </span>
                <span class="subtitle-1">
                  • {{ order_view.order_type_title }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-tabs v-model="selected_offer" left>
                  <v-tabs-slider color="primary" />
                  <!-- <v-tab>
										Выбрать
									</v-tab> -->
                  <v-tab> Купить </v-tab>
                </v-tabs>
                <v-tabs-items v-model="selected_offer">
                  <!-- select order -->
                  <!-- <v-tab-item class="pt-5">
                    <v-select
                      :items="getOrderByType(handleOrderType)"
                      v-model="order_from"
                      item-text="title"
                      item-value="id"
                      label="Выберите вашу заявку"
                      dense
                      outlined
                      @click="loadMyOrders"
                    />
                  </v-tab-item> -->
                  <!-- offer order -->
                  <v-tab-item class="pt-5">
                    <v-row>
                      <template v-for="(field, i) in orderTemplate">
                        <v-col
                          v-if="
                            field.field === 'price' ||
                            field.field === 'amount' ||
                            field.field === 'cost' ||
                            field.field === 'delivery' ||
                            field.field === 'payment'
                          "
                          :key="i"
                          :cols="
                            field.type === 'textarea' ||
                            field.type === 'file' ||
                            field.type === 'checkbox'
                              ? '12'
                              : field.type === 'auction_date' ||
                                field.type === 'auction_time'
                              ? '6'
                              : '6'
                          "
                        >
                          <template v-if="field.type === 'select'">
                            <v-select
                              :disabled="
                                field.field == 'type' ||
                                field.field == 'category' ||
                                !isAuction
                              "
                              :items="options[field.item]"
                              v-model="field.value"
                              item-text="title"
                              item-value="id"
                              :label="field.title"
                              dense
                              outlined
                              @click="GET_OPTIONS(field.item)"
                            />
                          </template>
                          <template
                            v-if="
                              field.type === 'input' ||
                              field.type === 'textarea'
                            "
                          >
                            <!-- <v-text-field
                              v-model="field.value"
                              :label="field.title"
                              outlined
                              dense
                              :disabled="
                                field.field == 'amount' ? false : !isAuction
                              "
                            >
                            </v-text-field> -->
                            <v-text-field
                              v-model="field.value"
                              :label="field.title"
                              outlined
                              dense
                              :disabled="
                                !isAuction && field.field == 'price'
                                  ? true
                                  : field.field == 'amount' ||
                                    field.field == 'price' ||
                                    field.field == 'cost'
                                  ? false
                                  : true
                              "
                            >
                            </v-text-field>
                          </template>
                          <template v-if="field.type === 'autocomplate'">
                            <v-text-field
                              v-model="field.value"
                              :label="field.title"
                              disabled
                              outlined
                              dense
                            >
                            </v-text-field>
                          </template>
                          <!-- <template v-if="field.type === 'checkbox'">
                          <v-checkbox
                            v-model="field.value"
                            :label="field.title"
                          ></v-checkbox>
                        </template> -->
                          <!-- <template v-if="field.type === 'file'">
                          <v-col>
                            <v-row class="mb-3" v-if="field.value">
                              <v-col
                                v-for="(file, i) in field.value"
                                :key="i"
                                cols="4"
                              >
                                <v-card>
                                  <v-img
                                    contain
                                    :src="fileurl(file)"
                                    height="150"
                                  />
                                </v-card>
                              </v-col>
                            </v-row>
                            <v-file-input
                              v-model="field.value"
                              label="Загрузить фотографии"
                              :rules="rules"
                              multiple
                              counter="3"
                              prepend-icon="mdi-image-plus"
                              outlined
                              dense
                            >
                              <template v-slot:selection="{ text }">
                                <v-chip small label color="primary">
                                  {{ text }}
                                </v-chip>
                              </template>
                            </v-file-input>
                          </v-col>
                        </template> -->
                          <template v-if="field.type === 'date'">
                            <v-text-field
                              v-model="field.value"
                              :label="field.title"
                              type="date"
                              outlined
                              dense
                              :rules="[rules.isEmpty]"
                            ></v-text-field>
                          </template>
                          <!-- <template v-if="field.type === 'auction_time'">
                          <v-text-field
                            :label="field.title"
                            v-model="field.value"
                            type="time"
                            outlined
                            dense
                            :rules="[rules.isSelecet]"
                          ></v-text-field>
                        </template> -->
                          <!-- <template v-if="field.type === 'auction_date'">
                          <v-text-field
                            v-model="field.value"
                            :label="field.title"
                            type="date"
                            outlined
                            dense
                            :rules="[rules.isEmpty]"
                          ></v-text-field>
                        </template> -->
                        </v-col>
                      </template>
                    </v-row>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="orange darken-1"
            text
            small
            @click="closeIsAddDealDialog"
          >
            Отмена
          </v-btn>
          <v-btn color="#78C3CC" elevation="0" small dark @click="createDeal">
            Отправить
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import Vue from "vue";

export default {
  data: () => ({
    order_from: null,
    selected_offer: null,
  }),
  computed: {
    ...mapState("order", ["order_view", "templates", "options"]),
    ...mapState("deal", ["isAddDealDialog"]),
    ...mapGetters("order", ["getOrderByType"]),
    handleOrderType() {
      return this.order_view.order_type == 1 ? 2 : 1;
    },
    rules(v) {
      const rules = [];
      if (this.max) {
        const rule = (v) =>
          (v || "").length <= this.max || `Выберите максимум ${this.max} файла`;
        rules.push(rule);
      }
      return rules;
    },
    // Шаблон для рендера
    orderTemplate() {
      return this.templates.orderEdit.map((t) => {
        let data =
          t.field == "type"
            ? {
                title: this.order_view.order_type_title,
                id: this.order_view.order_type,
              }
            : {
                title: this.order_view[t.field],
                id: this.order_view[t.field + "_id"],
              };
        if (t.type === "select") {
          this.SET_OPTIONS({
            option: t.item,
            data: [data],
          });
          return {
            ...t,
            value:
              t.field === "type"
                ? this.order_view.order_type
                : this.order_view[t.field + "_id"],
          };
        } else {
          return { ...t, value: this.order_view[t.field] };
        }
      });
    },
    isAuction() {
      let obj = this.orderTemplate.filter((f) => {
        return f.field == "is_auction";
      });
      return obj[0].value;
    },
  },
  methods: {
    ...mapActions("order", ["MY_ORDER_LIST", "GET_OPTIONS"]),
    ...mapActions("deal", ["CREATE_DEAL"]),
    ...mapMutations("deal", ["SET_IS_ADD_DEAL_DIALOG"]),
    ...mapMutations("order", ["SET_OPTIONS"]),
    closeIsAddDealDialog() {
      this.SET_IS_ADD_DEAL_DIALOG();
    },
    fileurl: (furl) => URL.createObjectURL(furl),
    loadMyOrders() {
      this.MY_ORDER_LIST(this.handleOrderType);
    },
    // calcField(field) {
    //   let calcfields = this.orderTemplate.filter(
    //     (f) =>
    //       f.field == "nds" ||
    //       f.field == "price" ||
    //       f.field == "amount" ||
    //       f.field == "cost"
    //   );
    //   if (
    //     field.field == "nds" &&
    //     calcfields[1].value > 0 &&
    //     calcfields[2].value > 0
    //   ) {
    //     let nds =
    //       field.value > 0
    //         ? (calcfields[1].value * calcfields[2].value * field.value) / 100
    //         : 0;
    //     calcfields[3].value = calcfields[1].value * calcfields[2].value + nds;
    //   }
    //   if (field.field == "price" && calcfields[2].value > 0) {
    //     let nds =
    //       calcfields[0].value > 0
    //         ? (calcfields[2].value * field.value * calcfields[0].value) / 100
    //         : 0;
    //     calcfields[3].value = field.value * calcfields[2].value + nds;
    //   }
    //   if (field.field == "amount") {
    //     let nds =
    //       calcfields[0].value > 0
    //         ? (calcfields[1].value * field.value * calcfields[0].value) / 100
    //         : 0;
    //     calcfields[3].value = field.value * calcfields[1].value + nds;
    //   }
    //   if (field.field == "cost") {
    //     let nds =
    //       calcfields[0].value > 0
    //         ? (calcfields[1].value *
    //             calcfields[2].value *
    //             calcfields[0].value) /
    //           100
    //         : 0;
    //     calcfields[1].value = Math.floor(
    //       (field.value - nds) / calcfields[2].value
    //     );
    //   }
    //   this.$forceUpdate();
    // },
    createDeal() {
      const getFormData = this.orderTemplate.reduce(
        (formData, { field, value }) => {
          if (field == "images") {
            value.map((img) => formData.append(field, img));
          } else if (field === "type") {
            formData.append(field, this.handleOrderType);
          } else if (field === "category") {
            formData.append(field, this.order_view.category_id);
          }
          // else if (
          //   field === "auction_date_start" ||
          //   field === "auction_date_end" ||
          //   field === "payment_date" ||
          //   field === "delivery_date"
          // ) {
          //   formData.append(field, "7777-06-06");
          // }
          else {
            formData.append(field, value);
          }
          return formData;
        },
        new FormData()
      );
      // let offer_order = this.templates.orderAdd.reduce(
      // 	(prev, { field, value }) => {
      // 		if (field === "type") {
      // 			prev[field] = this.handleOrderType;
      // 		} else if (field === "category") {
      // 			prev[field] = this.order_view.category_id;
      // 		} else {
      // 			prev[field] = value;
      // 		}
      // 		return prev;
      // 	},
      // 	{}
      // );
      let offer = {
        user_to: this.order_view.user_id,
        order_from: this.order_from,
        order_to: this.order_view.id,
      };
      this.CREATE_DEAL({ offer_type: this.selected_offer, getFormData, offer });
    },
  },
};
</script>
