<template>
<div>
  <div class="nav">
    hi {{ username }}
    <router-link to='/register' v-if:!isLoggedIn>Register</router-link>
    <router-link to='/login' v-if:!isLoggedIn>Login</router-link>
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
