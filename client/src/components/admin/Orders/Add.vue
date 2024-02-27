
<template>
  <v-row justify="center">
    <v-dialog
      v-model="isAddDialog"
      persistent
      :max-width="breakpoint == 'xs' ? '100%' : '60%'"
    >
      <template>
        <v-stepper v-model="e1">
          <v-stepper-header elevation="0">
            <template v-for="step in templates.orderAdd">
              <v-stepper-step
                color="#78C3CC"
                :complete="e1 > step.step"
                :step="step.step"
                :key="step.step"
              >
                Шаг {{ step.step }}
                <small>{{ step.title }}</small>
              </v-stepper-step>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <template v-for="step in templates.orderAdd">
              <v-form
                :ref="'step-' + step.step"
                v-model="valid"
                lazy-validation
                :key="step.step"
              >
                <v-stepper-content
                  :step="step.step"
                  :class="breakpoint == 'xs' && 'pa-0'"
                >
                  <v-card>
                    <v-card-title>
                      {{ step.title }}
                    </v-card-title>
                    <v-card-text>
                      <v-row no-gutters>
                        <v-col
                          v-for="(field, i) in step.fields"
                          :key="i"
                          :cols="breakpoint == 'xs' ? '12' : field.col"
                          class="px-2"
                        >
                          <template v-if="field.type == 'radio'">
                            <v-radio-group v-model="field.value" mandatory>
                              <v-radio
                                v-for="type in field.types"
                                :key="type.type"
                                :label="type.title"
                                :value="type.type"
                              ></v-radio>
                            </v-radio-group>
                          </template>
                          <template v-if="field.type === 'input'">
                            <v-text-field
                              v-model.number="field.value"
                              dense
                              :label="field.title"
                              outlined
                              :rules="
                                field.valid.required && !field.valid.type
                                  ? [rules.isEmpty]
                                  : field.valid.required &&
                                    field.valid.type == 'number'
                                  ? [rules.isNumber, rules.isEmpty]
                                  : []
                              "
                            ></v-text-field>
                          </template>
                          <template v-if="field.type === 'textarea'">
                            <v-textarea
                              v-model="field.value"
                              auto-grow
                              outlined
                              rows="1"
                              :label="field.title"
                            ></v-textarea>
                          </template>
                          <template v-if="field.type === 'file'">
                            <v-row class="mb-3" v-if="field.value">
                              <v-col
                                v-for="(file, i) in field.value"
                                :key="i"
                                cols="4"
                                class="py-0"
                              >
                                <v-card>
                                  <template
                                    v-if="
                                      file.type.includes(
                                        'image/jpeg',
                                        'image/png',
                                        'image/jpg'
                                      )
                                    "
                                  >
                                    <v-img :src="fileurl(file)" height="150">
                                    </v-img>
                                  </template>
                                  <template v-else>
                                    <v-card height="150">
                                      <v-card-title>
                                        <v-icon large left>
                                          mdi-file-document
                                        </v-icon>
                                      </v-card-title>
                                    </v-card>
                                  </template>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="12">
                                <v-file-input
                                  v-model="field.value"
                                  :label="field.title"
                                  :rules="field && [rules.isMaxFile]"
                                  multiple
                                  outlined
                                  dense
                                  :append-icon="
                                    field.field == 'certificate'
                                      ? 'mdi-certificate'
                                      : 'mdi-image-plus'
                                  "
                                >
                                </v-file-input>
                              </v-col>
                            </v-row>
                          </template>
                          <template v-if="field.type === 'autocomplate'">
                            <v-autocomplete
                              v-model="field.value"
                              :items="options.order_tnveds"
                              :loading="isLoadingTnveds"
                              :search-input.sync="search"
                              :filter="customFilter"
                              cache-items
                              no-data-text="Данные не найдены"
                              item-text="title"
                              outlined
                              hide-selected
                              dense
                              item-value="id"
                              :label="field.title"
                              :rules="[rules.isSelecet]"
                              placeholder="Введите названия тнвэд"
                            >
                              <template v-slot:item="data">
                                <v-list-item-content>
                                  <v-list-item-title
                                    v-html="data.item.id"
                                  ></v-list-item-title>
                                  <v-list-item-subtitle
                                    v-html="data.item.title"
                                  ></v-list-item-subtitle>
                                </v-list-item-content>
                              </template>
                            </v-autocomplete>
                          </template>
                          <template v-if="field.type === 'select'">
                            <v-select
                              :items="options[field.item]"
                              v-model="field.value"
                              item-text="title"
                              item-value="id"
                              :label="field.title"
                              dense
                              outlined
                              :rules="[rules.isSelecet]"
                              @click="GET_OPTIONS(field.item)"
                            >
                            </v-select>
                          </template>
                          <template v-if="field.type === 'checkbox'">
                            <v-checkbox
                              v-model="field.value"
                              :label="field.title"
                            ></v-checkbox>
                          </template>
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
                          <template v-if="field.type === 'auction_time'">
                            <v-text-field
                              :label="field.title"
                              v-model="field.value"
                              type="time"
                              outlined
                              dense
                              :rules="[rules.isSelecet]"
                            ></v-text-field>
                          </template>
                          <template v-if="field.type === 'auction_date'">
                            <v-text-field
                              v-model="field.value"
                              :label="field.title"
                              type="date"
                              outlined
                              dense
                              :rules="[rules.isEmpty]"
                            ></v-text-field>
                          </template>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="error"
                        dark
                        small
                        plain
                        elevation="0"
                        @click="closeIsAddDialog"
                      >
                        Закрыть
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        v-if="e1 != 1"
                        color="primary"
                        dark
                        small
                        plain
                        elevation="0"
                        @click="stepBackHandler"
                      >
                        Назад
                      </v-btn>
                      <v-btn
                        color="#78C3CC"
                        dark
                        small
                        elevation="0"
                        @click="stepNextHandler(step.step)"
                      >
                        {{
                          e1 == templates.orderAdd.length
                            ? "Добавить"
                            : "Продолжить"
                        }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </v-form>
            </template>
          </v-stepper-items>
        </v-stepper>
      </template></v-dialog
    ></v-row
  >
</template
    >

         
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import list from "../Catalog/Tnved/list.vue";

export default {
  components: { list },
  data: () => ({
    valid: true,
    search: "",
    tnved: "",
    e1: 1,
    debounce: null,
    rules: {
      isNumber: (v) =>
        (!isNaN(parseFloat(v)) && isFinite(v)) || "Введите число",
      isEmpty: (v) => {
        if (v == null || v == undefined || v == "") {
          return "Поле не может быть пустым.";
        } else {
          return true;
        }
      },
      isSelecet: (v) => !!v || "Выберите значение",
      isMaxFile: (v) => v.length <= 3 || `Выберите максимум 3 файла`,
    },
  }),
  computed: {
    ...mapState("order", [
      "isAddDialog",
      "options",
      "templates",
      "isLoadingTnveds",
    ]),
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
    isAuction() {
      let v = this.templates.orderEdit.filter((f) => f.field == "is_auction");
      return v[0].value;
    },
  },
  watch: {
    search: function (val) {
      val != "" && this.querySelections(val);
    },
  },
  methods: {
    ...mapMutations("order", ["SET_IS_ADD_DIALOG"]),
    ...mapActions("order", ["CREATE_ORDER", "GET_OPTIONS", "GET_ORDER_TNVED"]),
    stepNextHandler(step) {
      let formStep = this.templates.orderAdd.find((el) => el.step == step);
      formStep.fields.map((el) => {
        if (
          (el.valid.required && el.value == "") ||
          (el.valid.required && el.value == null)
        ) {
          this.valid = false;
          return this.$refs[`step-${step}`][0].validate();
        }
      });
      if (this.valid && this.e1 != this.templates.orderAdd.length) {
        this.e1++;
      }
      if (this.valid && step == this.templates.orderAdd.length) {
        let formData = new FormData();
        this.templates.orderAdd.map(({ fields }) => {
          fields.map(({ field, value }) => {
            if (field == "images" || field == "certificate") {
              value.map((img) => formData.append(field, img));
            } else {
              formData.append(field, value);
            }
          });
        });
        this.CREATE_ORDER(formData);
      }
    },
    stepBackHandler() {
      if (this.e1 != 1 && this.e1 > 1) {
        this.e1--;
        this.valid = true;
      }
    },
    // getField(f) {
    //   return this.templates.orderAdd[3].fields.filter(
    //     (field) => field.field == f
    //   )[0].value;
    // },
    // setField(f, v) {
    //   this.templates.orderAdd[3].fields.filter(
    //     (field) => field.field == f
    //   )[0].value = v;
    // },
    // calcField({ field, value }) {
    //   let nds = this.getField("nds");
    //   let price = this.getField("price");
    //   let amount = this.getField("amount");
    //   let cost = this.getField("cost");
    //   if (field == "nds" && price > 0 && amount > 0) {
    //     nds = (price * amount * value) / 100;
    //     cost = price * amount;
    //     this.setField("cost", cost + nds);
    //   }
    //   if (field == "price" && amount > 0) {
    //     nds = (value * amount * nds) / 100;
    //     this.setField("cost", value * amount + nds);
    //   }
    //   if (field == "amount" && price > 0) {
    //     nds = (price * value * nds) / 100;
    //     this.setField("cost", price * value + nds);
    //   }
    //   if (field == "cost") {
    //     nds = (value * nds) / 100;
    //     let without_nds = value - nds;
    //     price = without_nds / amount;
    //     this.setField("price", Math.floor(price));
    //   }

    //   /*let calcfields = this.templates.orderEdit.filter(
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
    //   }*/
    // },
    closeIsAddDialog() {
      this.SET_IS_ADD_DIALOG();
    },
    fileurl: (furl) => {
      return URL.createObjectURL(furl);
    },
    customFilter(item, queryText, itemText) {
      const id = item.id.toLowerCase();
      const title = item.title.toLowerCase();
      const searchText = queryText.toLowerCase();

      return id == queryText || title.indexOf(searchText) > -1;
    },
    // saveNewOrder() {
    // let formData = new FormData();
    // this.templates.orderEdit.map(({ field, value, valid }) => {
    //   if (
    //     (valid.required && value == "") ||
    //     (valid.required && value == null)
    //   ) {
    //     this.valid = false;
    //     return this.$refs.order.validate();
    //   } else if (field == "images" || field == "certificate") {
    //     value.map((img) => formData.append(field, img));
    //   }
    //   // else if (
    //   //   (this.isAuction && field == "auction_date_end" && value == "") ||
    //   //   (this.isAuction && field == "auction_date_start" && value == "") ||
    //   //   (this.isAuction && field == "auction_time_start" && value == "") ||
    //   //   (this.isAuction && field == "auction_time_end" && value == "")
    //   // ) {
    //   //   this.valid = false;
    //   //   return this.$refs.order.validate();
    //   // }
    //   else {
    //     formData.append(field, value);
    //   }
    // });
    // this.valid && this.CREATE_ORDER(formData);
    // },
    querySelections(v) {
      this.tnved = "";
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.tnved = v;
        this.GET_ORDER_TNVED(this.tnved);
      }, 1000);
    },
  },
};
</script>
<style scoped>
</style>
