<template>
  <div>
      <div>Login</div>
      <div>
        <label for="reg-username">Username: </label>
        <input type="text" id="reg-username" v-model="username"/>

        <label for="reg-password">Password: </label>
        <input type="password" id="reg-password" v-model="password"/>

        <input type="button" id="submit-login" v-on:click="submit" />
      </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      username: '',
      password: ''
    }
  },

  asyncData({store}) {
    console.log(store.state);
    return store.state.username;
  },

  methods: {
    submit: function() {
      console.log("hi")
    }
  }

}
</script>
