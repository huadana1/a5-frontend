import "@/assets/main.css";
import "primeicons/primeicons.css";
import "purecss";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import PrimeVue from "primevue/config";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(PrimeVue, { ripple: true }, { inputStyle: "filled" });

app.use(pinia);
app.use(router);

app.mount("#app");
