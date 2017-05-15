<template>
  <div>
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
    username() {
      return this.$store.state.username
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn
    }
  },
  components: {
    'navigation': navbar
  }
}
</script>
