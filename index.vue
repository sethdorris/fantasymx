<template>
<div id="app">
  <div class="nav">
    hi
    <router-link to='/register' >Register</router-link>
    <router-link to='/login' >Login</router-link>
  </div>
  <div class="content">
    <router-view></router-view>
  </div>
</div>
</template>

<style>
</style>

<script>
export default {
  computed: {
    username() {
      return this.$store.state.username
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn
    }
  }
}
</script>
