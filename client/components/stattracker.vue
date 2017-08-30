<template>
  <div>
    Live Stat Tracker
  </div>
</template>
<script>
import axios from 'axios';
  export default {
    data() {
      return {
      }
    },
    computed: {

    },
    created() {

    },
    methods: {

    },
    beforeCreate() {
      axios.get("/tracker")
      .then(data => {
        console.log(data)
      })
    }
  }
</script>
<style>

</style>
