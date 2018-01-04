<style scoped>
</style>

<template>
  <div v-once v-html="src">
  </div>
</template>

<script>
  // see vue-loader.conf
  export default {
    props: [ 'src' ]
  }
</script>
