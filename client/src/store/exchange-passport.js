import api from "./api";

export default {
  namespaced: true,
  state: {
    isAddPassport: false,
    isAddRegPay: false,
    options: {
      deals: [],
      users: [],
      exchange_passports: [],
    },
    passports: [],
    reg_pays: [],
    passport_reg_pays: [],
    passport_view: [],
    // в будущем данные "transactionTemplate" надо вывести в базу данных
    passportAddTemplate: [
      {
        field: "title",
        title: "Название биржевого паспорта",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "type",
        title: "Выберите сделку",
        value: null,
        type: "select",
        item: "deals",
        valid: {
          required: true,
        },
        col: "12",
      },
    ],
    // в будущем данные "transactionTemplate" надо вывести в базу данных
    regPayAddTemplate: [
      {
        field: "title",
        title: "Введите основание",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "user_from",
        title: "Отправитель",
        value: null,
        type: "select",
        item: "users",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "user_to",
        title: "Получатель",
        value: null,
        type: "select",
        item: "users",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "passport_id",
        title: "Выберите биржевой паспорт",
        value: null,
        type: "select",
        item: "exchange_passports",
        valid: {
          required: true,
        },
        col: "12",
      },
    ],
  },
  mutations: {
    SET_IS_ADD_PASSPORT: (state) =>
      (state.isAddPassport = !state.isAddPassport),
    SET_IS_ADD_REG_PAY: (state) => (state.isAddRegPay = !state.isAddRegPay),
    SET_OPTIONS(state, { option, data }) {
      return (state.options[option] = data);
    },
    SET_PASSPORTS: (state, data) => (state.passports = data),
    SET_REG_PAYS: (state, data) => (state.reg_pays = data),
    SET_PASSPORT_VIEW: (state, data) => (state.passport_view = data),
    SET_PASSPORT_REG_PAYS: (state, data) => (state.passport_reg_pays = data),
  },
  actions: {
    GET_OPTIONS: async ({ commit }, option) => {
      try {
        const { data } = await api.getOptions(option);
        commit("SET_OPTIONS", { option, data });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    CREATE_PASSPORT: async ({ commit, dispatch }, body) => {
      try {
        const { data } = await api.createPassport(body);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_PASSPORT_REG_PAYS: async ({ commit }, id) => {
      try {
        const { data } = await api.getPassportRegPays(id);
        commit("SET_PASSPORT_REG_PAYS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_MY_PASSPORT_LIST: async ({ commit }, role) => {
      try {
        const { data } =
          role == "ADMIN"
            ? await api.getExchangePassportAllList()
            : await api.getExchangePassportMyList();
        commit("SET_PASSPORTS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_PASSPORT_BY_ID: async ({ commit }, id) => {
      try {
        const { data } = await api.getPassportById(id);
        commit("SET_PASSPORT_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    UPLOAD_PASSPORT_FILES: async ({ commit, dispatch }, formdata) => {
      try {
        const { data } = await api.uploadPassportFiles(formdata.file);
        dispatch("GET_PASSPORT_BY_ID", formdata.passport_id);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_PASSPORT_FILE: async ({ commit, dispatch }, { pid, id }) => {
      try {
        const { data } = await api.deletePassportFile(id);
        dispatch("GET_PASSPORT_BY_ID", pid);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    CREATE_REG_PAY: async ({ commit, dispatch }, body) => {
      try {
        const { data } = await api.createRegPay(body);
        commit("SET_IS_ADD_REG_PAY");
        dispatch("GET_REG_PAY_ALL_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_REG_PAY_ALL_LIST: async ({ commit }) => {
      try {
        const { data } = await api.getRegPayAllList();
        commit("SET_REG_PAYS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_REG_PAY_BY_ID: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.deleteRegPayById(id);
        dispatch("GET_REG_PAY_ALL_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
