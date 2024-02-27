import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'ru',

  messages: {
    ru: {
      loginButton: 'Войти'
    },
    kg: {
      loginButton: 'Кируу'
    },
    en: {
      loginButton: 'Login'
    }
  }
});
