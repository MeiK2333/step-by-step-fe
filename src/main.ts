import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
import router from './router';

createApp(App).use(router).use(ElementPlus, { locale }).mount('#app');
