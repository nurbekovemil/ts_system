import api from "./api";

export default {
  namespaced: true,
  state: {
    deals: [],
    commission_reports: [],
    commission_reports_detail: [],
  },
  mutations: {
    SET_DEAL_REPORTS: (state, data) => (state.deals = data),
    SET_COMMISSION_REPORT: (state, data) => (state.commission_reports = data),
    SET_COMMISSION_REPORT_DETAIL: (state, data) =>
      (state.commission_reports_detail = data),
  },
  actions: {
    GET_DEAL_REPORTS: async ({ commit }, filters) => {
      try {
        const { data } = await api.getDealReports(filters);
        commit("SET_DEAL_REPORTS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_COMMISSION_REPORT: async ({ commit }, bydates) => {
      try {
        const { data } = await api.getCommissionReport(bydates);
        commit("SET_COMMISSION_REPORT", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_COMMISSION_REPORT_DETAIL: async ({ commit }, bydates) => {
      try {
        const { data } = await api.getCommissionReportDetail(bydates);
        commit("SET_COMMISSION_REPORT_DETAIL", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
