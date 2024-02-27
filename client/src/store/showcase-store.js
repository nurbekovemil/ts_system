import api from "./api";
import router from "../router";

export default {
  namespaced: true,
  state: {
    isAddDialog: false,
    isEditDialog: false,
    //  в будущем данные "blogTemplate" надо вывести в базу данных
    prodTemplate: [
      {
        field: "title",
        title: "Введите названия",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "total",
        title: "Количество",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "price",
        title: "Цена",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "6",
      },
      {
        field: "vendor_code",
        title: "Артикул",
        value: "",
        type: "input",
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "description",
        title: "Описание",
        value: "",
        type: "textarea",
        valid: {
          required: true,
        },
        col: "12",
      },
      {
        field: "products",
        title: "Изображение",
        value: [],
        type: "file",
        valid: {
          required: false,
        },
        col: "12",
      },
    ],
    products: [],
    prod_view: [],
  },
  mutations: {
    SET_IS_ADD_DIALOG: (state) => (state.isAddDialog = !state.isAddDialog),
    SET_IS_EDIT_DIALOG: (state) => (state.isEditDialog = !state.isEditDialog),
    SET_PROD: (state, data) => (state.products = data),
    SET_PROD_VIEW: (state, data) => (state.prod_view = data),
  },
  actions: {
    CREATE_PROD: async ({ commit, dispatch }, form) => {
      try {
        const { data } = await api.createProd(form);
        commit("SET_IS_ADD_DIALOG");
        dispatch("GET_PROD_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_PROD_LIST: async ({ commit }) => {
      try {
        const { data } = await api.getProdList();
        commit("SET_PROD", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_PROD_BY_ID: async ({ commit }, id) => {
      try {
        const { data } = await api.getProdById(id);
        commit("SET_PROD_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_PROD_IMAGE: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.deleteProdImage(id);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_PROD: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.deleteProdById(id);
        dispatch("GET_PROD_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
