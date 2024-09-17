import { createApp } from "vue";
import { Vue3Mq } from "vue3-mq";

import App from "./App.vue";
import "./main.css";

const app = createApp(App);
app.use(Vue3Mq, {
	global: true,
});

app.mount("#app");
