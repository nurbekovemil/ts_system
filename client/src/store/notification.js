import api from "./api";

export default {
  namespaced: true,
  state: {
    isAddDialog: false,
    isViewDialog: false,
    isEditDialog: false,
    notifications: [],
    notification: {},
    unreadCount: 0
  },
  mutations: {
    SET_IS_ADD_DIALOG: (state) => (state.isAddDialog = !state.isAddDialog),
    SET_IS_VIEW_DIALOG: (state) => (state.isViewDialog = !state.isViewDialog),
    SET_IS_EDIT_DIALOG: (state) => (state.isEditDialog = !state.isEditDialog),
    SET_NOTIFICATIONS: (state, data) => (state.notifications = data),
    SET_NOTIFICATION: (state, data) => (state.notification = data),
    SET_UNREAD_COUNT: (state, data) => (state.unreadCount = data.unread_count),
  },
  actions: {
    CREATE_NOTIFICATION: async ({ commit, dispatch }, createForm) => {
      try {
        const { data } = await api.createNotification(createForm);
        commit("SET_IS_ADD_DIALOG");
        dispatch("GET_NOTIFICATIONS");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    UPDATE_NOTIFICATION: async ({ commit, dispatch }, updateForm) => {
      try {
        const { data } = await api.updateNotification(updateForm);
        commit("SET_IS_EDIT_DIALOG");
        dispatch("GET_NOTIFICATIONS");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_NOTIFICATIONS: async ({ commit }) => {
      try {
        const { data } = await api.getNotifications();
        commit("SET_NOTIFICATIONS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_NOTIFICATION_BY_ID: async ({ commit, dispatch}, id) => {
      try {
        const { data } = await api.getNotificationById(id);
        commit("SET_NOTIFICATION", data);
        dispatch("GET_NOTIFICATIONS");
        dispatch("GET_COUNT_UNREAD_NOTIFICATIONS");
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_COUNT_UNREAD_NOTIFICATIONS: async ({ commit }) => {
      try {
        const { data } = await api.getCountUnreadNotifications();
        commit("SET_UNREAD_COUNT", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_NOTIFICATION: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.deleteNotification(id);
        dispatch("GET_NOTIFICATIONS");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
