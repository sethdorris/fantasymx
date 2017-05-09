import Vue from '../node_modules/vue/dist/vue.esm.js';
import VueResource from 'vue-resource';

Vue.use(VueResource);

var data = {
  username: "",
  email: "",
  password: ""
}

export default Vue.component("register", {
  data: function () {
    return data
  },
  template: `
  <div>
      <div>New Player Registration</div>
      <div>
        <label for="reg-username">Username: </label>
        <input type="text" id="reg-username" v-model="username"/>

        <label for="reg-email">Email: </label>
        <input type="email" id="reg-email" v-model="email"/>

        <label for="reg-password">Password: </label>
        <input type="password" id="reg-password" v-model="password"/>

        <button id="submit-register" v-on:click="submit">SUBMIT</button>
      </div>
  </div>
      `,
  methods: {
    submit: function (e) {
      console.log(data);
      //Do some data validation for security
      this.$http.post('/register', data, function (res) {
        console.log(res);
      }).then(function (data) {
        console.log(data)
      })
    }
  }
});
