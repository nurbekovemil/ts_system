<template>
  <v-row>
    <v-dialog v-model="isTransaction" persistent max-width="40%">
      <v-form ref="transfer" v-model="valid">
        <v-card>
          <v-card-title> Транзакция </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="12"
                v-if="user"
                class="d-flex align-end justify-space-between"
              >
                <div class="text-h6 px-2">{{ user.username }}</div>
                <div class="text-subtitle-1 px-2 font-weight-thin">
                  {{ user.count }} {{ user.symbol }}
                </div>
              </v-col>
              <v-col
                v-for="(field, i) in transactionTemplate"
                :key="i"
                :cols="field.col"
                class="px-2"
              >
                <template v-if="field.type == 'radio'">
                  <v-radio-group v-model="field.value" mandatory dense>
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
                    v-model="field.value"
                    dense
                    :label="field.title"
                    outlined
                    suffix="сом"
                    :rules="[isEmpty, isNumber]"
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
              @click="closeTransactionDialog"
            >
              Закрыть
            </v-btn>
            <v-spacer />
            <v-btn
              elevation="0"
              color="#78C3CC"
              dark
              small
              @click="createTransaction"
              >Продолжить</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    valid: true,
    isNumber: (v) => (!isNaN(parseFloat(v)) && isFinite(v)) || "Введите число",
    isEmpty: (v) => {
      if (v == null || v == undefined || v == "" || v.trim() == "") {
        return "Поле не может быть пустым.";
      } else {
        return true;
      }
    },
  }),
  computed: {
    ...mapState("transaction", [
      "user",
      "isTransaction",
      "transactionTemplate",
    ]),
  },
  methods: {
    ...mapMutations("transaction", ["TOGGLE_IS_TRANSACTION"]),
    ...mapActions("transaction", ["CREATE_TRANSACTION"]),
    closeTransactionDialog() {
      this.TOGGLE_IS_TRANSACTION(null);
    },
    createTransaction() {
      const data = {
        user_id: this.user.user_id,
        transaction_type: null,
        amount: null,
      };
      this.transactionTemplate.forEach(({ field, value }) => {
        if (
          value == "0" ||
          (typeof value == "string" && value.trim() == "") ||
          value == null
        ) {
          return this.$refs.transfer.validate();
        }
        data[field] = value;
      });
      this.valid && this.CREATE_TRANSACTION(data);
    },
  },
};
</script>

<style>
</style>