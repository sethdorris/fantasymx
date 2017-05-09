import Vue from '../node_modules/vue/dist/vue.esm.js';
import VueRouter from 'vue-router';
import leaderboard from './leaderboard-component';
import register from './register-component';
import login from './login-component';

Vue.use(VueRouter);

const routes = [
  { path: "/", component: leaderboard },
  { path: "/register", component: register },
  { path: "/login", component: login }
]

var router = new VueRouter({
  routes
})



Vue.component("navigation", {
  template: `
  <div>
    <ul>
      <li><router-link to="/register">Register</router-link></li>
      <li><router-link to="/login">Login</router-link></li>
    </ul>
  </div>`
});

new Vue({
  router,
  el: "#app"
})
