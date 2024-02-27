import api from "./api";

export default {
  namespaced: true,
  state: {
    currensies: [],
  },
  mutations: {
    SET_CURRENCY: (state, data) => (state.currensies = data),
  },
  actions: {
    async GET_CURRENT_EXCHANGE({ commit }) {
      try {
        const { data } = await api.getCurrentExchange();
        commit("SET_CURRENCY", data);
      } catch (err) {
        return err;
      }
    },
  },
};
