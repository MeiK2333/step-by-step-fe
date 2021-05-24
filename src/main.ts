import { createApp } from 'vue';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';
import 'dayjs/locale/zh-cn';
import router from './router';
import ElementPlus from 'element-plus';
import store from './store';
import Card from "./components/Card.vue";

const app = createApp(App);

app.use(store);
app.use(ElementPlus);
app.use(router);
app.component('card', Card);

app.mount('#app');
