import Vue from '../node_modules/vue/dist/vue.esm.js';
import VueResource from 'vue-resource';

Vue.use(VueResource);

var data = {
  username: "",
  password: ""
}

export default Vue.component("login", {
  data: function () {
    return data
  },
  template: `
  <div>
      <div>Login</div>
      <div>
        <label for="reg-username">Username: </label>
        <input type="text" id="reg-username" v-model="username"/>

        <label for="reg-password">Password: </label>
        <input type="password" id="reg-password" v-model="password"/>

        <button id="submit-login" v-on:click="submit">LOGIN</button>
      </div>
  </div>
      `,
  methods: {
    submit: function (e) {
      console.log(data);
      //Do some data validation for security
      this.$http.post('/login', data, function (res) {
        document.getElementById("submit-login").disabled = "true";
      }).then(function (data) {
        console.log(data)
      })
    }
  }
});
