import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArticleDetailView from "@/views/ArticleDetailView.vue";
import ErrorView from "@/views/ErrorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "homePage",
      component: HomeView,
    },
    {
      path: "/:id",
      name: "articleDetail",
      component: ArticleDetailView,
    },
    {
      path: "/500-error",
      name: "500error",
      component: ErrorView,
    },
    {
      path: "/404-error",
      name: "404error",
      component: ErrorView,
    },
  ],
});

export default router;
