import Vue from 'vue';
import App from './index.vue';
import { createRouter } from './router';

export function createApp (context) {
  const router = createRouter();
  const app = new Vue({
    router,
    render: h => h(App)
  })
  return { app, router };
}
