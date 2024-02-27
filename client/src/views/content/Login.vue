<template>
  <v-card
    class="mx-xs-5 mx-auto my-12 py-5 px-10"
    max-width="400"
    min-height="400"
    flat
    color="rgb(255, 255, 255)"
    @keyup.13="handleSubmit"
  >
    <div class="d-flex justify-center">
      <v-avatar size="100" tile>
        <v-icon size="100" color="#78C3CC">mdi-account-lock</v-icon>
        <!-- <img alt="logo" src="../../assets/logo.png" /> -->
      </v-avatar>
      <!-- <v-img src="../../assets/auth_account.png" max-width="150" /> -->
    </div>
    <v-card-subtitle class="text-center"> Авторизация </v-card-subtitle>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        class="pb-3"
        ref="username"
        v-model="username"
        label="Логин"
        prepend-inner-icon="mdi-account"
        dense
        outlined
        flat
        :rules="[rules.empty, rules.symbol]"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
        label="Пароль"
        prepend-inner-icon="mdi-lock"
        dense
        outlined
        :rules="[rules.empty]"
        flat
      ></v-text-field>
    </v-form>

    <v-btn app dark elevation="2" color="#78C3CC" @click="handleSubmit" block>
      Войти
    </v-btn>
    <v-btn color="primary" small text class="mt-5" router to="/registration"
      >Регистрация аккаунта</v-btn
    >
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    valid: true,
    showPassword: false,
    username: "",
    password: "",
    rules: {
      empty: (v) => !!v.trim() || "Поле не может быть пустым.",
      symbol: (v) =>
        !/[\s\\@\\\#%\^\&\*\(\)\[\]\+\_\{\}\`\~\=\|]/.test(v) ||
        "Некорректные данные.",
    },
  }),

  methods: {
    ...mapActions("user", ["LOGIN"]),
    handleSubmit() {
      if (!this.username || !this.password || !this.valid)
        return this.$refs.form.validate();
      this.LOGIN({ username: this.username, password: this.password });
    },
  },
};
</script>
<style lang=""></style>
