import api from "./api";

export default {
  namespaced: true,
  state: {
    table_rows: {
      users: {
        count: null,
        title: "Все пользователи",
        icon: "mdi-account-multiple",
      },
      orders: {
        count: null,
        title: "Все заявки",
        icon: "mdi-file-document-multiple",
      },
      deals: {
        count: null,
        title: "Все сделки",
        icon: "mdi-handshake",
      },
      // transactions: {
      //   count: null,
      //   title: "Все переводы",
      //   icon: "mdi-swap-horizontal",
      // },
    },
    in_processing_offers: [],
  },
  mutations: {
    SET_TABLE_ROWS: (state, { table, data }) => {
      state.table_rows[table].count = data.count;
    },
    SET_IN_PROCESSING_OFFERS: (state, data) =>
      (state.in_processing_offers = data),
  },
  actions: {
    async GET_TABLE_ROWS({ commit }, table) {
      try {
        const { data } = await api.getTableRows(table);
        commit("SET_TABLE_ROWS", { data, table });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    async GET_IN_PROCESSING_OFFERS({ commit }) {
      try {
        const { data } = await api.getInProcessingOffers();
        commit("SET_IN_PROCESSING_OFFERS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
  getters: {
    getRows: (state) => (table) => state.table_rows[table],
  },
};
