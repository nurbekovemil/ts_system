import api from "./api";
import router from "../router";

export default {
  namespaced: true,
  state: {
    isAddDialog: false,
    //  в будущем данные "blogTemplate" надо вывести в базу данных
    blogTemplate: [
      {
        field: "title",
        title: "Введите заголовок",
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
      // {
      //   field: "created_at",
      //   title: "Дата",
      //   value: "",
      //   type: "date",
      //   hint: "По умолчанию будет текущая дата",
      //   valid: {
      //     required: false,
      //   },
      //   col: "6",
      // },
      // {
      //   field: "time",
      //   title: "Время",
      //   value: "",
      //   type: "time",
      //   hint: "По умолчанию будет текущая время",
      //   valid: {
      //     required: false,
      //   },
      //   col: "6",
      // },
      {
        field: "blogs",
        title: "Изображение",
        value: [],
        type: "file",
        valid: {
          required: false,
        },
        col: "12",
      },
    ],
    blogs: [],
    blog_view: [],
  },
  mutations: {
    SET_IS_ADD_DIALOG: (state) => (state.isAddDialog = !state.isAddDialog),
    SET_BLOGS: (state, data) => (state.blogs = data),
    SET_BLOG_VIEW: (state, data) => (state.blog_view = data),
  },
  actions: {
    CREATE_BLOG: async ({ commit, dispatch }, form) => {
      try {
        const { data } = await api.createBlog(form);
        commit("SET_IS_ADD_DIALOG");
        dispatch("GET_BLOG_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_BLOG_LIST: async ({ commit }) => {
      try {
        const { data } = await api.getBlogList();
        commit("SET_BLOGS", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    GET_BLOG_BY_ID: async ({ commit }, id) => {
      try {
        const { data } = await api.getBlogById(id);
        commit("SET_BLOG_VIEW", data);
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
    DELETE_BLOG: async ({ commit, dispatch }, id) => {
      try {
        const { data } = await api.deleteBlogById(id);
        dispatch("GET_BLOG_LIST");
        commit("message/SUCCESS_MESSAGE", data, { root: true });
      } catch (error) {
        commit("message/ERROR_MESSAGE", error.response.data.error, {
          root: true,
        });
      }
    },
  },
};
