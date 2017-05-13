<template>
  <div>
      <div>Login</div>
      <div>
        <label for="reg-username">Username: </label>
        <input type="text" id="reg-username" v-model="username"/>

        <label for="reg-password">Password: </label>
        <input type="password" id="reg-password" v-model="password"/>

        <input v-on:click="submit" type="button" value="Login" id="submit-login" />
      </div>
  </div>
  </template>
  <script>
  import axios from 'axios';
  export default {
      data() {
        return {
          username: '',
          password: ''
        }
      },

      methods: {
        submit: function(e) {
          e.preventDefault();
          document.getElementById("submit-login").disabled = "true";
          axios.post('/login', {
            username: this.username,
            password: this.password
          }).then(data => {
            console.log(data);
          })
        }
      }
  }
</script>
