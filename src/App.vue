<script setup>
import { RouterView, useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "./services/ApiConfig";

axios.interceptors.response.use(null, function (error) {
  if (error.response.status === 500) {
    router.push("/500-error");
  }
  if (error.response.status === 404) {
    router.push("/404-error");
  }
  return Promise.reject(error);
});

const store = useStore();
const router = useRouter();
store.dispatch("fetchArticles");
</script>

<template>
  <RouterView />
</template>
