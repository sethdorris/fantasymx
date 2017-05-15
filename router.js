import Vue from 'vue';
import Router from 'vue-router';
import home from './client/components/leaderboard.vue';
import register from './client/components/register.vue';

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: "/", component: home },
      { path: "/register", component: register }
    ]
  })
}
