import Vue from 'vue';
import App from './index.vue';
import { createRouter } from './router';
import { createStore } from './store/store';
import { sync } from 'vuex-router-sync';

export function createApp (context) {
  const router = createRouter();
  const store = createStore();
  sync(store, router);
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store };
}
