<template>
  <div class="container detail">
    <div class="row">
      <div class="col-12">
        <div class="detail__body">
          <div class="text-center detail__loading" v-if="loading">
            <div class="spinner-border" role="status"></div>
          </div>
          <div class="detail__content" v-else>
            <h1 class="detail__title">{{ articleDetail.title }}</h1>
            <div class="detail__image">
              <img :src="articleDetail.image" />
            </div>
            <p class="detail__des">{{ articleDetail.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getArticleDetails } from "@/services/Article";

export default {
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const loading = ref(true);
    const articleDetail = ref({});
    const getArticleDetail = async () => {
      loading.value = true;
      try {
        const { data } = await getArticleDetails(id);
        articleDetail.value = data;
        loading.value = false;
      } catch (error) {
        console.log(error);
      }
    };
    onMounted(() => {
      getArticleDetail();
    });
    return {
      loading,
      articleDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./ArticleDetail.scss";
</style>
