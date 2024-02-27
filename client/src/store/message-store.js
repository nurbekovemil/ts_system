export default {
  namespaced: true,
  state: {
    alertMessage: {
      isAlert: false,
      text: "",
      color: "",
    },
  },
  mutations: {
    SUCCESS_MESSAGE(state, data) {
      state.alertMessage = {
        isAlert: true,
        text: data.message,
        color: "success",
        icon: "mdi-check-circle",
      };
    },
    WARNING_MESSAGE(state, data) {
      state.alertMessage = {
        isAlert: true,
        text: data.message,
        color: "warning",
        icon: "mdi-alert",
      };
    },
    ERROR_MESSAGE(state, data) {
      state.alertMessage = {
        isAlert: true,
        text: data.message,
        color: "error",
        icon: "mdi-alert-octagon",
      };
    },
    RESET_MESSAGE(state) {
      state.alertMessage = {
        isAlert: false,
        text: "",
        color: "",
      };
    },
  },
  getters: {
    GET_MESSAGE(state) {
      return state.alertMessage;
    },
  },
};
