<template>
  <v-row justify="center">
    <v-dialog v-model="isAddDialog" persistent width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Добавить нового пользователя</span>
        </v-card-title>
        <v-form ref="usercreate" v-model="valid" lazy-validation>
          <v-card-text>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="6"
                v-for="(field, i) in userAddTemplate"
                :key="i"
                class="px-2 mt-5"
              >
                <template v-if="field.type == 'input'">
                  <v-text-field
                    v-model="field.value"
                    :label="field.title"
                    outlined
                    dense
                    :rules="[rules.specSymbol, rules.isEmpty]"
                  ></v-text-field>
                </template>
                <template v-if="field.type == 'select'">
                  <v-select
                    v-model="field.value"
                    :items="getUserOptions(field.option)"
                    :label="field.title"
                    item-text="title"
                    item-value="type"
                    :rules="[rules.isSelecet]"
                    dense
                    outlined
                  ></v-select>
                </template>
              </v-col>
              <!-- <v-col cols="12">
              <v-text-field
                v-model="newUser.username"
                label="Логин пользователя"
                required
                outlined
                dense
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newUser.password"
                label="Пароль пользователя"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                required
                outlined
                dense
                prepend-inner-icon="mdi-lock"
              ></v-text-field>
            </v-col> -->
            </v-row>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small text @click="closeAddUserDialog">
            Закрыть
          </v-btn>
          <v-btn color="#78C3CC" dark small @click="userCreate">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
  data: () => ({
    valid: false,
    rules: {
      isEmpty: (v) =>
        (!!v.trim() && v.length > 3) ||
        "Поле не может быть пустым и как минимум 3 символа.",
      isSelecet: (v) => !!v || "Выберите значение",
      specSymbol: (v) =>
        !/[а-яА-ЯЁё^\s]/.test(v) ||
        "Введите только латинские символы или нижнее подчеркивание.",
    },
    showPassword: false,
  }),
  computed: {
    ...mapState("user", ["isAddDialog", "userAddTemplate"]),
    ...mapGetters("user", ["getUserOptions"]),
  },
  methods: {
    ...mapActions("user", ["CREATEUSER"]),
    ...mapMutations("user", ["TOGGLE_ADD_DIALOG"]),
    closeAddUserDialog() {
      this.TOGGLE_ADD_DIALOG();
    },
    userCreate() {
      let user = this.userAddTemplate.reduce((prev, { field, type, value }) => {
        if ((type == "input" && value.trim() == "") || value == "") {
          return this.$refs.usercreate.validate();
        }
        return {
          ...prev,
          [field]: value,
        };
      }, {});
      this.valid && this.CREATEUSER(user);
    },
  },
};
</script>

<style lang="">
</style>`