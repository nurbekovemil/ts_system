import api from "./api";

export default {
  namespaced: true,
  state: {
    isEditCatalog: false,
    isAddCatalog: false,
    categories: [],
    category_orders: [],
    tnved_categories: [],
    latest_orders: [],
    catalog: [
      {
        table: "order_categories",
        items: [],
        title: "Категории",
        icon: "mdi-format-list-bulleted-square",
      },
      {
        table: "order_currencies",
        items: [],
        title: "Валюты",
        icon: "mdi-currency-usd",
      },
      {
        table: "order_deliveries",
        items: [],
        title: "Доставки",
        icon: "mdi-truck-fast",
      },
      {
        table: "order_payments",
        items: [],
        title: "Оплаты",
        icon: "mdi-credit-card-outline",
      },
      {
        table: "order_weights",
        items: [],
        title: "Единицы измерения",
        icon: "mdi-format-line-weight",
      },
    ],
  },
  mutations: {
    SET_IS_DIALOG: (state, isState) => (state[isState] = !state[isState]),
    SET_TNVED: (state, data) => (state.tnved_categories = data),
    SET_CATEGORIES: (state, data) => (state.categories = data),
    SET_CATEGORY_ORDERS: (state, data) => (state.category_orders = data),
    SET_LATEST_ORDERS: (state, data) => (state.latest_orders = data),
    SET_CATALOG: (state, { table, data }) => {
      state.catalog.map((item) => item.table == table && (item.items = data));
    },
    SET_IS_ADD_DIALOG: (state) => (state.isAddCatalog = !state.isAddCatalog),
    SET_IS_EDIT_DIALOG: (state) => (state.isEditCatalog = !state.isEditCatalog),
  },
  actions: {
    GET_TNVED_CATEGORIES: async ({ commit }, page) => {
      try {
        const { data } = await api.getTnvedCategories(page);
        commit("SET_TNVED", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_CATEGORIES: async ({ commit }) => {
      try {
        const { data } = await api.getCategories();
        commit("SET_CATEGORIES", data);
      } catch (error) {}
    },
    GET_CATEGORY_ORDERS: async ({ commit }, id) => {
      try {
        const { data } = await api.getCategoryOrders(id);
        commit("SET_CATEGORY_ORDERS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_LATESTORDERS: async ({ commit }, order_ids) => {
      try {
        const { data } = await api.getLatestOrders(order_ids);
        commit("SET_LATEST_ORDERS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_CATALOG_BY_TABLE: async ({ commit }, table) => {
      try {
        const { data } = await api.getCatalogByTable(table);
        commit("SET_CATALOG", { table, data });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    UPDATE_ITEM_IN_CATALOG: async ({ commit, dispatch }, item) => {
      try {
        const { data } = await api.updateCatalogItem(item);
        dispatch("GET_CATALOG_BY_TABLE", item.table);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    CREATE_CATALOG_ITEM: async ({ commit, dispatch }, item) => {
      try {
        const { data } = await api.createCatalogItem(item);
        dispatch("GET_CATALOG_BY_TABLE", item.table);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_CATALOG_ITEM: async ({ commit, dispatch }, item) => {
      try {
        const { data } = await api.deleteCatalogItem(item);
        dispatch("GET_CATALOG_BY_TABLE", item.table);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
