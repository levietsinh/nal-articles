<template>
  <div class="container error">
    <div class="row">
      <div class="col-12">
        <img :src="getImageUrl()" :alt="pathName" />
        <p class="error__message">
          Opps, something went wrong, please try again or go to
          <span class="error__home" @click="router.push('/')">Home Page</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

// Images
import error500img from "@/assets/images/500-error.svg";
import error404img from "@/assets/images/404-error.svg";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const pathName = computed(() => route.name);
    const getImageUrl = () => {
      switch (pathName.value) {
        case "500error":
          return error500img;
        case "404error":
          return error404img;
        default:
          break;
      }
    };

    return {
      route,
      pathName,
      router,
      getImageUrl,
    };
  },
};
</script>

<style scoped lang="scss">
@import "./ErrorStatus.scss";
</style>
