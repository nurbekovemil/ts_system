import router from "../router";
import api from "./api";

export default {
  namespaced: true,
  state: {
    isAddDialog: false,
    isEditDialog: false,
    isUserIdit: false,
    isUserStatus: false,
    isAuth: false,
    user: {},
    userMenus: [],
    usersList: {
      users: [],
      user_count: 0,
    },
    // в будущем данные "user_type" надо вывести в базу данных
    user_type: [
      { title: "Биржевой дилер", type: 1 },
      { title: "Биржевой брокер", type: 2 },
      { title: "Специалист по закупкам", type: 3 },
    ],
    // в будущем данные "roles" надо вывести в базу данных
    roles: [
      { type: 2, title: "Пользователь" },
      { type: 1, title: "Администратор" },
      { type: 3, title: "Депозитарий" },
    ],
    // в будущем данные "userAddTemplate" надо вывести в базу данных
    userAddTemplate: [
      { field: "username", title: "Логин", type: "input", value: "" },
      { field: "password", title: "Пароль", type: "input", value: "" },
      {
        field: "type",
        title: "Тип пользователя",
        type: "select",
        option: "user_type",
        value: "",
      },
      {
        field: "role",
        title: "Роль",
        type: "select",
        option: "roles",
        value: "",
      },
    ],
    template: [],
    user_view: [],
  },
  mutations: {
    SET_USER: (state, data) => {
      state.user = data.user;
      state.userMenus = data.menus;
    },
    SET_IS_AUTH: (state, data) => {
      state.isAuth = data;
    },
    LOG_OUT: (state) => {
      state.user = {};
    },
    SETUSERSLIST: (state, data) => {
      state.usersList.users = data.users;
      state.usersList.user_count = data.user_count;
    },
    TOGGLE_ADD_DIALOG: (state) => {
      state.isAddDialog = !state.isAddDialog;
    },
    TOGGLE_EDIT_DIALOG: (state) => {
      state.isEditDialog = !state.isEditDialog;
    },
    TOGGLE_IS_USER_STATUS_DIALOG: (state) => {
      state.isUserStatus = !state.isUserStatus;
    },
    SET_USER_REGISTER_TEMPLATE: (state, data) => {
      state.template = data.template;
    },
    SET_USER_VIEW: (state, data) => {
      state.user_view = data;
    },
  },
  actions: {
    async LOGIN({ commit }, loginData) {
      try {
        const { data } = await api.userLogin(loginData);
        localStorage.setItem("token", data.token);
        commit("SET_IS_AUTH", true);
        commit("SET_USER", data);
        router.push("/dashboard");
      } catch (error) {
        localStorage.removeItem("token");
        commit("SET_IS_AUTH", false);
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    async GET_ME({ commit }) {
      try {
        if (localStorage.getItem("token")) {
          const { data } = await api.userGetMe();
          commit("SET_IS_AUTH", true);
          commit("SET_USER", data);
          router.history._startLocation != router.history.current.path &&
            router.push(router.history._startLocation);
        }
      } catch (error) {
        localStorage.removeItem("token");
        commit("SET_IS_AUTH", false);
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
        router.push("/login");
      }
    },
    async GET_USER_BY_ID({ commit }, id) {
      try {
        const { data } = await api.getUserById(id);

        commit("SET_USER_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    async UPDATE_USER_STATUS({ commit, dispatch }, status) {
      try {
        const { data } = await api.updateUserStatus(status);
        if (status.login && status.status == 2) {
          commit("TOGGLE_IS_USER_STATUS_DIALOG");
        }
        dispatch("GET_USER_BY_ID", status.user_id);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    LOGOUT({ commit }) {
      localStorage.removeItem("token");
      commit("SET_IS_AUTH", false);
      commit("LOG_OUT");
      router.push("/");
    },

    async CREATEUSER({ commit, dispatch }, user) {
      try {
        const { data } = await api.createUser(user);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
        dispatch("USERLIST");
        commit("TOGGLE_ADD_DIALOG");
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },

    async USERLIST({ commit }, query) {
      try {
        const { data } = await api.userList(query);
        commit("SETUSERSLIST", data);
      } catch (error) {}
    },

    async DELETEUSER({ commit, dispatch }, id) {
      try {
        const { data } = await api.deleteUser(id);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
        dispatch("USERLIST");
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    async UPDATEUSER({ commit, dispatch }, update) {
      try {
        const { data } = await api.updateUser(update);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
        dispatch("USERLIST");
        commit("TOGGLE_EDIT_DIALOG");
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    async GET_USER_REGISTER_TEMPLATE({ commit }, type) {
      try {
        const { data } = await api.getUserRegisterTemplate(type);
        commit("SET_USER_REGISTER_TEMPLATE", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    async USER_REGISTER({ commit }, data) {
      try {
        const res = await api.userRegister(data);
        commit("message/SUCCESS_MESSAGE", res.data, { root: true });
        router.push("/login");
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    async PROFILE({ commit }) {
      try {
        const { data } = await api.getProfile();
        commit("SET_USER_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },

    async UPDATE_USER_DATA({ commit, dispatch }, user) {
      try {
        const { data } = await api.updateUserData(user);
        dispatch("GET_USER_BY_ID", user.id);
        commit("TOGGLE_EDIT_DIALOG");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
  getters: {
    getUserOptions: (state) => (opt) => state[opt],
  },
};
