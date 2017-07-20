<template>
  <div>
    <div>MY TEAM</div>
  </div>


</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
  export default {
    computed: mapGetters([
      'getUserData'
    ]),
    beforeCreate() {
      axios.get('/GetAllAvailableRiders')
      .then(data => {
        console.log(data);
      })
    }
  }
</script>
