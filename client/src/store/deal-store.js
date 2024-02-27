import api from "./api";
import router from "../router";

export default {
  namespaced: true,
  state: {
    isAddDealDialog: false,
    deals: [],
    deal_view: [],
    deal_comments: [],
    deal_orders: [],
    offer_history: [],
    trade_list: [],
    trade_order_from: [],
    trade_order_to: [],
  },
  mutations: {
    SET_IS_ADD_DEAL_DIALOG: (state) =>
      (state.isAddDealDialog = !state.isAddDealDialog),
    SET_DEAL_VIEW: (state, data) => {
      state.deal_view = data.deal;
      state.deal_comments = data.comments;
    },
    SET_DEALS: (state, data) => (state.deals = data),
    SET_DEAL_ORDERS: (state, data) => (state.deal_orders = data),
    SET_OFFER_HISTORY: (state, data) => (state.offer_history = data),
    SET_TRADE_LIST: (state, data) => (state.trade_list = data),
    SET_INIT_DATA: (state, data) => (state[data.data] = []),
    SET_TRADE_ORDERS: (state, data) => (state[data.order] = data.data),
  },
  actions: {
    CREATE_DEAL: async ({ commit }, { offer_type, getFormData, offer }) => {
      try {
        // при покупке предложить уже существующих заявок поставить 1 пока 0
        if (offer_type === 0) {
          const order = await api.createOrderPrivate(getFormData);
          offer.order_from = order.data.rows.id;

          const deal = await api.createDeal(offer);
          commit("message/SUCCESS_MESSAGE", deal.data, { root: true });
          commit("SET_IS_ADD_DEAL_DIALOG");
          router.push(`/dashboard/all-orders`);
        } else {
          const deal = await api.createDeal(offer);
          commit("message/SUCCESS_MESSAGE", deal.data, { root: true });
          commit("SET_IS_ADD_DEAL_DIALOG");
        }
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_DEAL_LIST: async ({ commit }, status) => {
      try {
        const { data } = await api.getDealList(status);
        commit("SET_DEALS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    ADD_DEAL_NUMBER: async ({ commit }, payload) => {
      try {
        const { data } = await api.addDealNumber(payload);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_DEAL_ORDERS: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.getDealOrders(id);
        commit("SET_DEAL_ORDERS", data);
        dispatch("GET_DEAL_BY_ID", id);
      } catch (error) {}
    },
    GET_DEAL_BY_ID: async ({ commit }, id) => {
      try {
        const { data } = await api.getDealById(id);
        commit("SET_DEAL_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    UPDATE_DEAL_STATUS: async ({ commit, dispatch }, status) => {
      try {
        const { data } = await api.updateDealStatus(status);
        dispatch("GET_DEAL_BY_ID", status.deal_id);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
        if (status.status == 2 || status.status == 5) {
          router.push(`/dashboard/deal/${status.deal_id}`);
        }
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    UPDATE_DEAL_STATUS_WITH_COMMENT: async ({ commit, dispatch }, formData) => {
      try {
        const { data } = await api.updateDealStatusWithComment(
          formData.formData
        );
        dispatch("GET_DEAL_BY_ID", formData.deal_id);
        commit("SET_INIT_DATA", { data: "deal_comments" });
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_OFFER_HISTORY: async ({ commit }, id) => {
      try {
        const { data } = await api.getOfferHistory(id);
        commit("SET_OFFER_HISTORY", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_OFFER_BY_ID: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.deleteOfferById(id);
        dispatch("GET_DEAL_LIST", 3);
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TRADE_LIST: async ({ commit }, date) => {
      try {
        const { data } = await api.getTradeList(date);
        commit("SET_TRADE_LIST", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TRADE_BY_ID: async ({ commit }, id) => {
      try {
        const { data } = await api.getTradeById(id);
        commit("SET_DEAL_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_DEPO_DEALS: async ({ commit }, date) => {
      try {
        const { data } = await api.getDepoDeals(date);
        commit("SET_DEALS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_TRADE_ORDER_BY_ID: async ({ commit }, types) => {
      try {
        const { data } = await api.getOrderByIdPublic(types.id);
        commit("SET_TRADE_ORDERS", { order: types.type, data });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
