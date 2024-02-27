import api from "./api";
import router from "../router";

export default {
  namespaced: true,
  state: {
    user: null,
    user_accounts: [],
    isTransaction: false,
    // в будущем данные "transactionTemplate" надо вывести в базу данных
    transactionTemplate: [
      {
        field: "transaction_type",
        title: "Выберите тип операции",
        value: null,
        type: "radio",
        types: [
          {
            type: 1,
            title: "Депонирование",
          },
          {
            type: 2,
            title: "Списание",
          },
        ],
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "amount",
        title: "Введите сумму",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "12",
      },
    ],
    transaction_list: [],
    transaction_count: 0,
    transaction: [],
  },
  mutations: {
    SET_USER_ACCOUNTS: (state, data) => (state.user_accounts = data),
    SET_TRANSACTION_LIST: (state, data) => {
      state.transaction_list = data.list;
      state.transaction_count = data.count;
    },
    SET_TRANSACTION_BY_ID: (state, data) => (state.transaction = data),
    TOGGLE_IS_TRANSACTION: (state, data) => {
      state.user = data;
      state.isTransaction = !state.isTransaction;
    },
  },
  actions: {
    GET_USER_ACCOUNTS: async ({ commit }) => {
      try {
        const { data } = await api.getUserAccounts();
        commit("SET_USER_ACCOUNTS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    CREATE_TRANSACTION: async ({ commit }, body) => {
      try {
        const { data } = await api.createTransaction(body);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
        commit("TOGGLE_IS_TRANSACTION", null);
        router.push("/dashboard/transactions");
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TRANSACTION_LIST: async ({ commit }, query) => {
      try {
        const { data } = await api.getTransactionList(query);
        commit("SET_TRANSACTION_LIST", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TRANSACTION_BY_ID: async ({ commit }, id) => {
      try {
        const { data } = await api.getTransactionById(id);
        commit("SET_TRANSACTION_BY_ID", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    UPDATE_TRANSACTION_STATUS: async ({ commit, dispatch }, queries) => {
      try {
        const { data } = await api.updateTransactionStatus(queries);
        dispatch("GET_TRANSACTION_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
