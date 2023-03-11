<template>
  <div class="container article">
    <div class="row">
      <div class="article__content">
        <div class="article__actions">
          <button
            type="button"
            class="btn btn-success article__add-btn"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-whatever="@mdo"
            @click="handleAddArticle"
            :disabled="loading"
          >
            Add new
          </button>
          <div class="article__functions">
            <span class="me-2">Sort by:</span>
            <div class="dropdown me-3 d-inline-block">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="dropdownMenu2"
              >
                {{ sortName }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <li v-for="sortBy in sortList" :key="sortBy.value">
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="handleChangeSortType(sortBy)"
                  >
                    {{ sortBy.label }}
                  </button>
                </li>
              </ul>
            </div>
            <div class="dropdown me-0 me-md-5 d-inline-block">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ orderName }}
              </button>
              <ul class="dropdown-menu">
                <li v-for="order in orderList" :key="order.value">
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="handleChangeOrder(order)"
                  >
                    {{ order.label }}
                  </button>
                </li>
              </ul>
            </div>
            <form
              class="form-inline d-flex article__search-form"
              @submit.prevent="handleSearch"
            >
              <input
                class="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                v-model="searchInput"
                :disabled="loading"
              />
              <button
                class="btn btn-outline-success ms-2 my-sm-0"
                type="submit"
                :disabled="loading"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <div class="text-center article__loading" v-if="loading">
          <div class="spinner-border" role="status"></div>
        </div>
        <div v-else>
          <div class="article__no-result my-3" v-if="!articlesList.length">
            No results
          </div>
          <div class="article__result" v-else>
            <ul class="list-unstyled article__list">
              <li
                class="d-flex py-3 border-bottom article__item"
                v-for="article in articlesList"
                :key="article.id"
              >
                <div class="flex-shrink-0 article__image">
                  <img
                    :src="article.image"
                    @click="handleGotoDetail(article.id)"
                  />
                </div>
                <div class="flex-grow-1 ms-0 ms-md-3 mt-3 mt-md-0">
                  <h5
                    class="mt-0 article__title"
                    @click="handleGotoDetail(article.id)"
                  >
                    {{ article.title }}
                  </h5>
                  <p class="article__content">{{ article.content }}</p>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-bs-whatever="@mdo"
                    @click="handleEditArticle(article)"
                  >
                    Edit
                  </button>
                </div>
              </li>
            </ul>
            <nav aria-label="Page navigation">
              <ul class="pagination article__pagination">
                <li class="page-item">
                  <a
                    class="page-link"
                    :class="{ disabled: parameters.page === 1 }"
                    href="#"
                    aria-label="Previous"
                    @click="handleChangePage(1)"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>

                <li
                  class="page-item"
                  :class="{ active: pageItem === parameters.page }"
                  aria-current="page"
                  v-for="pageItem of totalPage"
                  :key="pageItem"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click="handleChangePage(pageItem)"
                    >{{ pageItem }}</a
                  >
                </li>
                <li class="page-item">
                  <a
                    class="page-link"
                    :class="{ disabled: parameters.page === totalPage }"
                    href="#"
                    aria-label="Next"
                    @click="handleChangePage(totalPage)"
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ArticleForm
    :isEdit="isEdit"
    :data="editData"
    @update-article="handleUpdateArticle"
    @add-article="handleCreateArticle"
  />
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { uuid } from "vue3-uuid";
import { useStore } from "vuex";

//Components
import ArticleForm from "@/components/article-form/ArticleForm.vue";

export default {
  components: {
    ArticleForm,
  },
  setup() {
    const store = useStore();

    const articlesList = computed(() => store.state.articleList);
    const loading = computed(() => store.state.loadingArticles);
    const parameters = computed(() => store.state.parameters);
    const totalArticles = computed(() => store.state.totalArticles);

    const router = useRouter();
    const totalItems = ref(0);
    const totalPage = ref(0);
    const isEdit = ref(false);
    const editData = ref({});
    const searchInput = ref(parameters.value.search);
    const sortList = ref([
      { label: "Default", value: "id" },
      { label: "Title", value: "title" },
      { label: "Content", value: "content" },
      { label: "Create Date", value: "createdAt" },
    ]);

    const orderList = ref([
      { label: "Ascending", value: "asc" },
      { label: "Descending", value: "desc" },
    ]);

    const sortName = computed(
      () =>
        sortList.value.find((item) => item.value === parameters.value.sortBy)
          .label
    );
    const orderName = computed(
      () =>
        orderList.value.find((item) => item.value === parameters.value.order)
          .label
    );

    const handleChangePage = (page) => {
      store.commit("setParameters", { page });
      store.dispatch("fetchArticles");
    };

    const handleGotoDetail = (id) => router.push(`/${id}`);

    const handleEditArticle = (data) => {
      isEdit.value = true;
      editData.value = data;
    };

    const handleUpdateArticle = (data) => {
      const articleIndex = articlesList.value.findIndex(
        (item) => item.id === data.id
      );
      store.commit("setUpdateArticle", { index: articleIndex, data });
      editData.value = {};
    };

    const handleAddArticle = () => {
      isEdit.value = false;
      editData.value = {};
    };

    const handleCreateArticle = (data) => {
      const newArticle = { ...data, id: uuid.v1() };
      store.commit("setArticleList", [newArticle, ...articlesList.value]);
    };

    const handleSearch = () => {
      store.commit("setParameters", { search: searchInput, page: 1 });
      store.dispatch("fetchArticles");
    };

    const handleChangeOrder = (event) => {
      store.commit("setParameters", { order: event.value });
      store.dispatch("fetchArticles");
    };

    const handleChangeSortType = (event) => {
      store.commit("setParameters", { sortBy: event.value });
      store.dispatch("fetchArticles");
    };

    watch(articlesList, (value) => {
      totalItems.value = value.length;
      totalPage.value = Math.ceil(totalArticles.value / parameters.value.limit);
    });

    return {
      articlesList,
      loading,
      totalPage,
      isEdit,
      editData,
      parameters,
      searchInput,
      orderList,
      sortList,
      sortName,
      orderName,
      handleChangePage,
      handleGotoDetail,
      handleEditArticle,
      handleUpdateArticle,
      handleAddArticle,
      handleCreateArticle,
      handleSearch,
      handleChangeOrder,
      handleChangeSortType,
    };
  },
};
</script>

<style scoped lang="scss">
@import "./ArticleList.scss";
</style>
