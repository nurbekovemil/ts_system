
<template>
  <v-row>
    <v-dialog v-model="isAddRegPay" persistent max-width="60%">
      <v-form ref="regPay" v-model="valid">
        <v-card>
          <v-card-title> Регистрация </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                v-for="(field, i) in regPayAddTemplate"
                :key="i"
                :cols="breakpoint == 'xs' ? '12' : field.col"
                class="px-2"
              >
                <template v-if="field.type === 'input'">
                  <v-text-field
                    v-model="field.value"
                    dense
                    :label="field.title"
                    outlined
                    :rules="field.valid.required && [isEmpty]"
                  ></v-text-field>
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
                    :rules="[isSelecet]"
                    @click="GET_OPTIONS(field.item)"
                  >
                  </v-select>
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
              @click="closeRegPayDialog"
            >
              Закрыть
            </v-btn>
            <v-spacer />
            <v-btn
              elevation="0"
              color="#78C3CC"
              dark
              small
              @click="createRegPay"
              >Опубликовать</v-btn
            >
          </v-card-actions>
          <div id="blog"></div>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      valid: true,
      isEmpty: (v) => {
        if (v == null || v == undefined || v == "" || v.trim() == "") {
          return "Поле не может быть пустым.";
        } else {
          return true;
        }
      },
      isSelecet: (v) => !!v || "Выберите значение",
    };
  },

  computed: {
    ...mapState("passport", ["isAddRegPay", "regPayAddTemplate", "options"]),
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
  },
  methods: {
    ...mapMutations("passport", ["SET_IS_ADD_REG_PAY"]),
    ...mapActions("passport", ["CREATE_REG_PAY", "GET_OPTIONS"]),
    closeRegPayDialog() {
      this.SET_IS_ADD_REG_PAY();
    },
    createRegPay() {
      this.regPayAddTemplate.map(({ field, value, valid }) => {
        if (
          (valid.required && value == "") ||
          (valid.required && value == null)
        ) {
          this.valid = false;
          return this.$refs.regPay.validate();
        }
      });
      let regpay = this.regPayAddTemplate.reduce(
        (prev, { field, value }) => ((prev[field] = value), prev),
        {}
      );
      this.valid && this.CREATE_REG_PAY(regpay);
    },
  },
};
</script>