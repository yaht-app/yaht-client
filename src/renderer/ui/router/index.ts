import Home from '@/renderer/ui/views/Home.vue';
import ReflectionNotification from '@/renderer/ui/views/ReflectionNotification.vue';
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
    path: '/reflection-notification',
    name: 'ReflectionNotification',
    component: ReflectionNotification,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
