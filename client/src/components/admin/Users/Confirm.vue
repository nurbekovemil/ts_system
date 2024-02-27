<template>
  <v-row justify="center">
    <v-dialog v-model="isUserStatus" persistent max-width="600">
      <v-card>
        <v-form ref="confirm_user" v-model="valid" lazy-validation>
          <v-card-title class="text-h5"> Создайте логин и пароль </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" md="6" class="mr-3">
                <v-text-field
                  v-model="login"
                  label="Введите логин"
                  outlined
                  dense
                  :rules="[rules.specSymbol, rules.isEmpty]"
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="password"
                  label="Введите пароль"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  required
                  outlined
                  dense
                  :rules="[rules.isEmpty]"
                  prepend-inner-icon="mdi-lock"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error darken-1" small text @click="cancelUserConfirm">
              Отмена
            </v-btn>
            <v-btn color="green darken-1" small dark @click="acceptUserConfirm">
              Продолжить
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data: () => ({
    valid: false,
    rules: {
      isEmpty: (v) =>
        (!!v.trim() && v.length > 3) ||
        "Поле не может быть пустым и как минимум 3 символа.",
      specSymbol: (v) =>
        !/[а-яА-ЯЁё^\s]/.test(v) ||
        "Введите только латинские символы или нижнее подчеркивание.",
    },
    showPassword: false,
    login: "",
    password: "",
  }),
  computed: {
    ...mapState("user", ["isUserStatus", "user_view"]),
  },
  methods: {
    ...mapMutations("user", ["TOGGLE_IS_USER_STATUS_DIALOG"]),
    ...mapActions("user", ["UPDATE_USER_STATUS"]),
    cancelUserConfirm() {
      this.TOGGLE_IS_USER_STATUS_DIALOG();
    },
    acceptUserConfirm() {
      if (!this.login || !this.password) {
        return this.$refs.confirm_user.validate();
      } else {
        this.UPDATE_USER_STATUS({
          status: 2,
          user_id: this.user_view.id,
          login: this.login,
          password: this.password,
        });
      }
    },
  },
};
</script>