import api from "./api";
import router from "../router";

export default {
  namespaced: true,
  state: {
    isAddTender: false,
    options: {
      tender_types: [],
      tender_cities: [],
      tender_categories: [],
    },
    tenders: [],
    tender_view: [],
    // в будущем данные "transactionTemplate" надо вывести в базу данных
    tenderAddTemplate: [
      {
        field: "title",
        title: "Название объявления",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "type",
        title: "Тип объявления",
        value: null,
        type: "select",
        item: "tender_types",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "category",
        title: "Категория объявления",
        value: null,
        type: "select",
        item: "tender_categories",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "city",
        title: "Город / область",
        value: null,
        type: "select",
        item: "tender_cities",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "deadline",
        title: "Крайний срок ",
        value: null,
        type: "date",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "description",
        title: "Описание объявления",
        value: "",
        type: "textarea",
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "tenders",
        title: "Прикрепить файл",
        value: [],
        type: "file",
        valid: {
          required: false,
        },
        col: "12",
      },
    ],
  },
  mutations: {
    SET_IS_ADD_TENDER: (state) => (state.isAddTender = !state.isAddTender),
    SET_OPTIONS(state, { option, data }) {
      return (state.options[option] = data);
    },
    SET_TENDERS: (state, data) => (state.tenders = data),
    SET_TENDER_VIEW: (state, data) => (state.tender_view = data),
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
    CREATE_TENDER: async ({ commit, dispatch }, body) => {
      try {
        const { data } = await api.createTender(body);
        dispatch("GET_TENDER_LIST");
        commit("SET_IS_ADD_TENDER");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TENDER_LIST: async ({ commit }) => {
      try {
        const { data } = await api.getTenderList();
        commit("SET_TENDERS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TENDER_BY_ID: async ({ commit }, id) => {
      try {
        const { data } = await api.getTenderById(id);
        commit("SET_TENDER_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TENDER_ALL_LIST: async ({ commit }, role) => {
      try {
        const { data } =
          role == "ADMIN"
            ? await api.getTenderPrivateAllList()
            : await api.getTenderPublicAllList();
        commit("SET_TENDERS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    UPDATE_TENDER_STATUS: async ({ commit, dispatch }, query) => {
      try {
        const { data } = await api.updateTenderStatus(query);
        dispatch("GET_TENDER_BY_ID", query.id);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_TENDER: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.deleteTender(id);
        dispatch("GET_TENDER_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
