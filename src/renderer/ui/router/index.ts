import Home from '@/renderer/ui/views/Home.vue';
import ExperienceNotification from '@/renderer/ui/views/ExperienceNotification.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/experience-notification',
    name: 'ExperienceNotification',
    component: ExperienceNotification,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
