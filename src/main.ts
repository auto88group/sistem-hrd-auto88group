/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Styles
import "unfonts.css";
import "./styles/tailwind.css";
import "./styles/main.scss";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
authStore.initAuth();

registerPlugins(app);

app.mount("#app");
