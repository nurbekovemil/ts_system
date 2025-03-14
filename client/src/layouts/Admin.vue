<template>
  <v-app id="inspire">
    <v-app-bar app color="#78C3CC" dark>
      <v-app-bar-nav-icon @click="drawerHandler"></v-app-bar-nav-icon>
      <div class="text-xs-body-2 text-md-body-1">
        {{ this.$router.history.current.name }}
      </div>
      <v-spacer></v-spacer>
      {{ user.count }} сом
      <v-btn class="mx-1" router to="/" plain icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-menu offset-y transition="slide-x-transition" bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar size="36" v-bind="attrs" v-on="on">
            <img src="../assets/john.jpg" alt="avatar" />
          </v-avatar>
        </template>
        <v-list nav dense width="150">
          <v-list-item-group>
            <v-list-item router to="/dashboard/profile">
              <v-list-item-content>
                <v-list-item-title> {{ user.username }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item @click="LOGOUT">
              <v-list-item-content>
                <v-list-item-title> Выйти </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app dark color="grey darken-4">
      <v-list-item>
        <v-list-item-avatar tile>
          <v-img max-width="40" src="../assets/logo.png" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> TS KSE </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list nav dense>
        <v-list-item
          v-for="menu in userMenus"
          :key="menu.id"
          router
          :to="menu.route"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
              <v-list-item-title>
                {{ menu.name }}
                <template v-if="menu.route == '/dashboard/notifications' && unreadCount > 0">
                  <v-chip
                      color="#c8eac9"
                      :style="'color: green'"
                      class="ml-2"
                      x-small
                      >
                        {{ unreadCount }}
                      </v-chip>
                </template>
              </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2 text-center white--text">
          <strong>Kyrgyz Stock Exchange</strong>
        </div>
      </template>
    </v-navigation-drawer>
    <v-container>
      <v-slide-x-transition mode="out-in">
        <router-view />
      </v-slide-x-transition>
    </v-container>
  </v-app>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    drawer: true,
  }),
  computed: {
    ...mapState("user", ["user", "userMenus"]),
    ...mapState("notification", ["unreadCount"]),
  },
  mounted(){
    this.GET_COUNT_UNREAD_NOTIFICATIONS()
  },
  methods: {
    ...mapActions("user", ["LOGOUT"]),
    ...mapActions('notification',['GET_COUNT_UNREAD_NOTIFICATIONS']),
    drawerHandler() {
      this.drawer = !this.drawer;
    },
  },
};
</script>
