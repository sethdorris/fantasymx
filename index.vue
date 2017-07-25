<template>
  <div id="app">
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<style>
</style>

<script>
import navbar from './client/components/navbar.vue';
export default {
  computed: {
    username: function() {
      return this.$store.state.username
    },
    isLoggedIn: function() {
      return this.$store.state.isLoggedIn
    }
  },
  components: {
    'navigation': navbar
  }
}
</script>
