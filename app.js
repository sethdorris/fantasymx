import Vue from 'vue';
import App from './index.vue';
import { createRouter } from './router';
import store from './store/store';

var router = createRouter();
const app = new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
}).$mount("#app")
