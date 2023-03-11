import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import UUID from "vue3-uuid";
import store from "./store";

const app = createApp(App).use(router).use(UUID).use(store);
app.mount("#app");
