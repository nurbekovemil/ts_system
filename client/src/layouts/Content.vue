<template>
  <v-app>
    <v-app-bar flat app color="white">
      <v-container class="py-0 px-0 fill-height">
        <router-link class="text-decoration-none text--primary" to="/">
          <v-toolbar-title
            class="overflow-visible d-flex align-center"
            router
            to="/"
          >
            <v-avatar class="mr-1" :size="breakpoint == 'xs' ? 35 : 48" tile>
              <img alt="logo" src="../assets/logo.png" />
            </v-avatar>
            <span
              :style="
                breakpoint == 'xs'
                  ? 'font-size: 14px;'
                  : 'font-size: 1rem!important;'
              "
            >
              Товарно-сырьевой сектор <br />
              Кыргызской фондовой биржи
            </span>
          </v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <!-- computers -->
        <div class="d-none d-md-flex justify-around">
          <v-btn elevation="0" plain small router to="/"> Главная </v-btn>
          <!-- <v-btn plain small router to="/about"> О Бирже </v-btn> -->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn plain small v-bind="attrs" v-on="on">
                О бирже <v-icon right> mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item router to="/about">
                <v-list-item-title>Общая информация</v-list-item-title>
              </v-list-item>
              <v-list-item router to="/ksedocuments">
                <v-list-item-title> Документы</v-list-item-title>
              </v-list-item>
              <v-list-item router to="/tariffs">
                <v-list-item-title>Тарифы</v-list-item-title>
              </v-list-item>
              <v-list-item router to="/handbooks">
                <v-list-item-title>Справочник</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn plain small router to="/blogs"> Новости </v-btn>
          <v-btn plain small router to="/catalog"> Каталог товаров </v-btn>
          <!-- <v-btn plain small router to="/products"> Продажа имущества </v-btn> -->

          <!-- <v-btn plain small router to="/tenders"> Тендеры </v-btn> -->
          <!-- <v-btn plain small router to="/handbooks"> Справочник</v-btn> -->
          <v-btn plain small router to="/trades"> Итоги торгов </v-btn>
          <!-- <v-btn plain small router to="/documents"> Документы </v-btn> -->
          <v-btn plain small router to="/login">
            <template v-if="!isAuth"> Войти</template>
            <template v-else>
              {{ user.username }}
            </template>
          </v-btn>
        </div>
      </v-container>
      <v-app-bar-nav-icon
        left
        @click="drawer = true"
        class="d-flex d-md-none"
      />
    </v-app-bar>
    <div
      class="py-1"
      style="background: rgb(120, 195, 204); max-height: 50px; min-width: 100%"
    >
      <v-container class="py-0 d-flex justify-md-end justify-center">
        <kse-date class="white--text" />
      </v-container>
    </div>

    <v-container class="pa-0 main-content" fluid>
      <router-view />
    </v-container>

    <v-navigation-drawer v-model="drawer" fixed temporary left>
      <!-- for mobiles -->
      <v-list>
        <v-list-item-group>
          <v-list-item router to="/">
            <v-list-item-title>
              <v-btn elevation="0" plain small> Главная </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn plain small router to="/blogs">Новости</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-group no-action>
            <template v-slot:activator>
              <v-list-item-title>
                <v-btn plain small>О бирже </v-btn>
              </v-list-item-title>
            </template>
            <v-list-item router to="/about" dense>
              <v-list-item-title color="grey">
                Общая информация
              </v-list-item-title>
              <!-- <v-btn plain small router to="/about"> Общая информация </v-btn> -->
            </v-list-item>
            <v-list-item plain router to="/ksedocuments" dense>
              <v-list-item-title>Документы</v-list-item-title>
              <!-- <v-btn plain small router to="/documents"> Документы</v-btn> -->
            </v-list-item>
            <v-list-item router to="/tariffs" dense>
              <v-list-item-title>Тарифы</v-list-item-title>

              <!-- <v-btn plain small router to="/tariffs"> Тарифы </v-btn> -->
            </v-list-item>
          </v-list-group>
          <v-list-item router to="/categories">
            <v-list-item-title>
              <v-btn elevation="0" plain small> Категории </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item router to="/handbooks">
            <v-list-item-title>
              <v-btn plain small> Справочник </v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item router to="/trades">
            <v-list-item-title>
              <v-btn plain small> Итоги торгов </v-btn>
            </v-list-item-title>
          </v-list-item>
          <!-- <v-list-item>
            <v-list-item-title>
              <v-btn plain small router to="/documents"> Документы </v-btn>
            </v-list-item-title>
          </v-list-item> -->
          <v-list-item router to="/catalog">
            <v-list-item-title>
              <v-btn plain small> Каталог товаров </v-btn>
            </v-list-item-title>
          </v-list-item>

          <v-list-item router to="/login">
            <v-list-item-title>
              <v-btn plain small>
                <template v-if="!isAuth"> Войти </template>

                <template v-else>
                  {{ user.username }}
                </template>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-footer padless class="mt-3 wrap-footer">
      <v-row>
        <v-col class="pb-0">
          <v-card
            elevation="0"
            flat
            tile
            color="#78C3CC"
            class="white-text text-center"
          >
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-card-title class="white--text">
                    Партнерские сайты
                  </v-card-title>
                  <v-card-text class="footer-about align-start white--text">
                    <p>
                      <a
                        href="https://www.kse.kg/"
                        class="white--text subtitle-1"
                        >Кыргызская Фондовая Биржа</a
                      >
                    </p>
                    <p>
                      <a
                        href="https://mab-sng.org/"
                        class="white--text subtitle-1"
                        >Международная Ассоциация Бирж</a
                      >
                    </p>
                  </v-card-text>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card-title class="pl-md-0 white--text"
                    >Адрес
                  </v-card-title>
                  <v-card-text
                    class="footer-about align-start pl-md-0 white--text"
                    color="red"
                  >
                    <p class="subtitle-1">Кыргызская Республика</p>
                    <p class="subtitle-1">г. Бишкек, ул. Московская, 172</p>
                  </v-card-text>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card-title class="pl-md-0 white--text">
                    Контакты
                  </v-card-title>
                  <v-card-text
                    class="footer-about align-start white--text pl-md-0"
                  >
                    <p class="subtitle-1">+996 312 31 14 84</p>
                    <p
                      class="subtitle-1 d-flex align-center"
                      style="display: flex; align-items: center"
                    >
                      <span class="white--text mr-2" height="28px" style=""
                        >+996 551 31 14 84</span
                      >
                      <a href="https://wa.me/+996551311484" style="height: 28px"
                        ><img
                          height="28px"
                          src="../../public/img/whatsapp-icon.png"
                          alt=""
                      /></a>
                      <a
                        href="https://telegram.me/+996551311484"
                        style="height: 28px"
                        ><img
                          height="28px"
                          src="../../public/img/telegram-icon.png"
                          alt=""
                      /></a>
                    </p>
                    <p class="subtitle-1">office@kse.kg</p>
                  </v-card-text>
                </v-col>
              </v-row>

              <v-divider color="white"></v-divider>

              <v-card-text class="white--text">
                {{ new Date().getFullYear() }} —
                <strong>Kyrgyz Stock Exchange</strong>
              </v-card-text>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import KseDate from "../components/content/Date/KseDate.vue";
export default {
  data: () => ({
    drawer: false,
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
  computed: {
    ...mapState("user", ["user", "isAuth"]),
    breakpoint() {
      return this.$vuetify.breakpoint.name;
    },
  },
  components: {
    KseDate,
  },
};
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 303px);
}
.footer-color {
  background: #ddeffd;
}
.footer-about {
  text-align: start;
}
.contact-content {
  text-align: start;
}
.wrap-footer a {
  text-decoration: none;
}
</style>

















