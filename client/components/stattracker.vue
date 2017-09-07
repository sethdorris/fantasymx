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
      var ws = new WebSocket("wss://localhost:3000/tracker");
      ws.onopen = function () {
        ws.send("Hi")
      }
      ws.onmessage = function (e) {
        console.log(JSON.parse(e.data))
      }
      ws.onerror = function (e) {
        console.log("Error", e)
      }
    }
  }
</script>
<style>

</style>
