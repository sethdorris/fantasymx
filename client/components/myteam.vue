<template>
  <div>
    <div>MY TEAM</div>
  </div>


</template>

<script>
import axios from 'axios';
  export default {
    data() {
      return {
        availableRiders: []
      }
    },
    beforeCreate() {
      axios.get('/GetAllAvailableRiders')
      .then(data => {
        console.log(data);
      })
    }
  }
</script>
