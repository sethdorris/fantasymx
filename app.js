import Vue from 'vue';
import App from './index.vue';
import { createRouter } from './router';
import { createStore } from './store/store';

var router = createRouter();
var store = createStore();
const app = new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
}).$mount("#app")
