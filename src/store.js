import { createStore } from "vuex";
import { getArticles } from "@/services/Article.js";

const store = createStore({
  state() {
    return {
      articleList: [],
      loadingArticles: true,
      parameters: {
        page: 1,
        limit: 10,
        sortBy: "id",
        order: "asc",
        search: "",
      },
      totalArticles: 100,
    };
  },
  mutations: {
    setArticleList(state, payload) {
      state.articleList = payload;
    },
    setLoadingArticles(state, payload) {
      state.loadingArticles = payload;
    },
    setUpdateArticle(state, { index, data }) {
      state.articleList[index] = data;
    },
    setParameters(state, payload) {
      state.parameters = { ...state.parameters, ...payload };
    },
  },
  actions: {
    async fetchArticles({ state, commit }) {
      commit("setLoadingArticles", true);
      try {
        const { data } = await getArticles(state.parameters);
        commit("setArticleList", data);
      } catch (error) {
        console.log(error);
      } finally {
        commit("setLoadingArticles", false);
      }
    },
  },
});

export default store;
