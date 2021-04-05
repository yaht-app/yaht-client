import 'reflect-metadata';
import container from '@/config/inversify.config';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'tailwindcss/tailwind.css';

Vue.config.productionTip = false;

Vue.prototype.$container = container;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
