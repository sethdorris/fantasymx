import Vue from 'vue';
import Router from 'vue-router';
import index from './index.vue';
import register from './client/components/register.vue';
import login from './client/components/login.vue';

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: "/", component: index },
      { path: "/register", component: register },
      { path: '/login', component: login }

    ]
  })
}
