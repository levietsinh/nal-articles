<template>
  <div
    class="modal fade article__form-modal"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            {{ props.isEdit ? "Edit Article" : "Create Article" }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="article__form">
            <div class="mb-3">
              <label
                for="article-title"
                class="col-form-label article__form-label"
                >Title</label
              >
              <input
                type="text"
                class="form-control article__form-field"
                :class="{ error: v$.title.$error }"
                id="article-title"
                v-model="state.title"
                placeholder="Title"
              />
              <span v-if="v$.title.$error" class="article__form-error">
                {{ v$.title.$errors[0].$message }}
              </span>
            </div>
            <div class="mb-3">
              <label
                for="article-image"
                class="col-form-label article__form-label"
                >Image</label
              >
              <div class="article__form-image">
                <img
                  :src="state.image || defaultImage"
                  class="article__form-image"
                />
              </div>
              <div class="article__image-selector">
                <div class="btn btn-primary">Choose another Picture</div>
                <input
                  type="file"
                  class="form-control article__form-field"
                  :class="{ error: v$.image.$error }"
                  id="article-image"
                  @change="handleChooseImage"
                />
              </div>
              <span v-if="v$.image.$error" class="article__form-error">
                {{ v$.image.$errors[0].$message }}
              </span>
            </div>
            <div class="mb-3">
              <label
                for="article-content"
                class="col-form-label article__form-label"
                >Content</label
              >
              <textarea
                class="form-control article__form-field"
                :class="{ error: v$.content.$error }"
                id="article-content"
                v-model="state.content"
                placeholder="Content"
                rows="5"
              ></textarea>
              <span v-if="v$.content.$error" class="article__form-error">
                {{ v$.content.$errors[0].$message }}
              </span>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary me-2"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="onSubmit">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch, ref } from "vue";
import { Modal } from "bootstrap";
import { required, minLength, maxLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

//Images
import defaultImage from "@/assets/images/default-thumbnail.jpg";

export default {
  props: {
    isEdit: Boolean,
    data: Object,
  },
  emits: ["update-article", "add-article"],
  setup(props, ctx) {
    const state = reactive({
      image: null,
      title: "",
      content: "",
    });

    const modalRef = ref(null);

    watch(
      () => props.data,
      (value) => {
        (state.title = value.title),
          (state.content = value.content),
          (state.image = value.image);
      }
    );

    const rules = {
      image: { required },
      title: { required, maxLength: maxLength(50) },
      content: {
        required,
        minLength: minLength(50),
        maxLength: maxLength(550),
      },
    };
    const v$ = useVuelidate(rules, state);

    const closeModal = () => {
      v$.value.$reset();
      Modal.getInstance(modalRef.value)?.hide();
    };

    const onSubmit = async () => {
      const result = await v$.value.$validate();
      if (result) {
        if (props.isEdit)
          ctx.emit("update-article", { ...props.data, ...state });
        else ctx.emit("add-article", state);
      } else return false;
      closeModal();
    };

    const handleChooseImage = (event) => {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      state.image = imageUrl;
    };

    return {
      props,
      defaultImage,
      state,
      v$,
      modalRef,
      onSubmit,
      handleChooseImage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./ArticleForm.scss";
</style>
